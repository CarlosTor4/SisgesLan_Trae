import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Plus, Edit, Trash2, Image, ChefHat, Calendar, Clock, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import BurgerIcon from "@/assets/burger-icon.svg";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type Produto = {
  id?: string;
  auth_user_id?: string;
  codigo_prod: string;
  descricao_prod: string;
  preco_venda_prod: number;
  preco_custo_prod: number;
  quantidade_estoque_prod: number;
  preco_medio_prod: number;
  preco_minimo_prod?: number;
  estoque_minimo_prod?: number;
  despesa_icms_prod?: number;
  despesa_frete_prod?: number;
  outras_despesas_prod?: number;
  foto_url_prod?: string | null;
  criado_em?: string;
};

const emptyProduto: Produto = {
  codigo_prod: "",
  descricao_prod: "",
  preco_venda_prod: 0,
  preco_custo_prod: 0,
  quantidade_estoque_prod: 0,
  preco_medio_prod: 0,
  preco_minimo_prod: 0,
  estoque_minimo_prod: 0,
  despesa_icms_prod: 0,
  despesa_frete_prod: 0,
  outras_despesas_prod: 0,
  foto_url_prod: null,
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<Produto>(emptyProduto);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filtro, setFiltro] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const { toast } = useToast();

  const produtosFiltrados = useMemo(() => {
    const filtroLower = filtro.toLowerCase();
    return produtos.filter(p => 
      p.codigo_prod.toLowerCase().includes(filtroLower) ||
      p.descricao_prod.toLowerCase().includes(filtroLower)
    );
  }, [produtos, filtro]);

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const precoMedioCalc = useMemo(() => {
    const base = Number(form.preco_custo_prod || 0);
    const icms = Number(form.despesa_icms_prod || 0);
    const frete = Number(form.despesa_frete_prod || 0);
    const outras = Number(form.outras_despesas_prod || 0);
    return Number((base + icms + frete + outras).toFixed(2));
  }, [form.preco_custo_prod, form.despesa_icms_prod, form.despesa_frete_prod, form.outras_despesas_prod]);

  useEffect(() => {
    setForm((f) => ({ ...f, preco_medio_prod: precoMedioCalc }));
  }, [precoMedioCalc]);

  async function fetchProdutos() {
    setPageLoading(true);
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select(
          "id, auth_user_id, codigo_prod, descricao_prod, preco_venda_prod, preco_custo_prod, quantidade_estoque_prod, preco_medio_prod, preco_minimo_prod, estoque_minimo_prod, despesa_icms_prod, despesa_frete_prod, outras_despesas_prod, foto_url_prod, criado_em"
        )
        .order("criado_em", { ascending: false });
      if (error) {
        console.error(error.message);
        setProdutos([]);
        return;
      }

      if (data) {
        console.log("Produtos fetched:", data);
        setProdutos(data);
      } else {
        setProdutos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutos([]);
    } finally {
      setPageLoading(false);
    }
  }

  function openForCreate() {
    setEditing(null);
    setForm(emptyProduto);
    setFotoFile(null);
    setOpenModal(true);
  }

  function openForEdit(p: Produto) {
    console.log("Opening for edit:", p);
    setEditing(p);
    setForm({ ...p });
    setFotoFile(null);
    setOpenModal(true);
  }

  function toNumber(v: string | number) {
    if (typeof v === "number") return v;
    // Remove R$, pontos e substitui vírgula por ponto para conversão correta
    const n = parseFloat(String(v).replace(/[R$\s.]/g, "").replace(/,/g, "."));
    return isNaN(n) ? 0 : n;
  }
  
  function handleCurrencyChange(field: keyof Produto, value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits === '') {
        setField(field, 0 as any);
        return;
    }
    const numericValue = Number(digits) / 100;
    setField(field, numericValue as any);
  }

  async function uploadFotoIfNeeded(): Promise<string | null> {
    if (!fotoFile) {
      return form.foto_url_prod || null;
    }
    const fileName = `foto_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("produtos")
      .upload(fileName, fotoFile, { contentType: fotoFile.type, upsert: true });
    if (error) {
      console.error("Erro no upload da foto:", error.message);
      // On upload error, we should not save a new photo url.
      // We return the existing path if available.
      return form.foto_url_prod || null;
    }
    return data.path;
  }

  function getPublicUrl(filePath: string | null | undefined): string | undefined {
    if (!filePath) return undefined;
    const { data } = supabase.storage.from("produtos").getPublicUrl(filePath);
    return data?.publicUrl;
  }

  async function saveProduto() {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id || null;
      const fotoUrl = await uploadFotoIfNeeded();
      const payload = {
        auth_user_id: userId || undefined,
        codigo_prod: form.codigo_prod.trim(),
        descricao_prod: form.descricao_prod.trim(),
        preco_venda_prod: toNumber(form.preco_venda_prod),
        preco_custo_prod: toNumber(form.preco_custo_prod),
        quantidade_estoque_prod: Number(form.quantidade_estoque_prod || 0),
        preco_medio_prod: toNumber(form.preco_medio_prod),
        preco_minimo_prod: toNumber(form.preco_minimo_prod || 0),
        estoque_minimo_prod: Number(form.estoque_minimo_prod || 0),
        despesa_icms_prod: toNumber(form.despesa_icms_prod || 0),
        despesa_frete_prod: toNumber(form.despesa_frete_prod || 0),
        outras_despesas_prod: toNumber(form.outras_despesas_prod || 0),
        foto_url_prod: fotoUrl,
      } as Produto;

      if (editing?.id) {
        const { data, error } = await supabase
          .from("produtos")
          .update(payload)
          .eq("id", editing.id)
          .select();
        if (error) throw error;
        if (data && data[0]) {
          const updated = data[0] as Produto;
          setProdutos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      } else {
        const { data, error } = await supabase
          .from("produtos")
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          const created = data[0] as Produto;
          setProdutos((prev) => [created, ...prev]);
        }
      }
      toast({
        title: "Sucesso!",
        description: "Produto salvo com sucesso.",
      });
      setOpenModal(false);
      setForm(emptyProduto);
    } catch (err: any) {
      console.error("Erro detalhado ao salvar produto:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduto(p: Produto) {
    try {
      const { error } = await supabase.from("produtos").delete().eq("id", p.id!);
      if (error) throw error;
      setProdutos((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err: any) {
      console.error("Erro ao excluir produto:", err);
    }
  }

  function setField<K extends keyof Produto>(key: K, value: Produto[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Card principal com título dentro do card, seguindo o padrão de Colaboradores */}
      <div className="rounded-lg border border-border bg-card text-foreground overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img src={BurgerIcon} alt="Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-white">Lista de Produtos ({produtos.length})</h2>
                <p className="text-xs text-white/70">Gerencie os produtos cadastrados</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>{currentTime.toLocaleDateString()}</span>
                  <Clock className="w-3 h-3 text-primary" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={openForCreate} className="w-full sm:w-auto bg-[#f5b301] text-black hover:bg-[#EAB308]">
            <Plus className="w-4 h-4 mr-2" />
            Inserir Produto
          </Button>
        </div>

        <div className="p-4 sm:p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Buscar por código ou descrição..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full max-w-sm pl-10 bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors" 
            />
          </div>
        </div>

        <div className="md:overflow-x-auto">
          <Table className="min-w-full md:min-w-[720px] border-separate border-spacing-y-4 md:border-spacing-y-0">
            <TableHeader className="hidden md:table-header-group">
              <TableRow>
                <TableHead className="text-primary">Foto</TableHead>
                <TableHead className="text-primary">Código</TableHead>
                <TableHead className="text-primary">Descrição</TableHead>
                <TableHead className="text-primary">Preço Venda</TableHead>
                <TableHead className="text-primary">Estoque</TableHead>
                <TableHead className="text-primary">Cadastro</TableHead>
                <TableHead className="text-primary">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="md:table-row-group">
              {pageLoading ? (
                <TableRow className="md:table-row">
                  <TableCell colSpan={7} className="h-48 text-center p-0">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((p) => (
                  <TableRow key={p.id} className="flex flex-col md:table-row text-white bg-[#252529] rounded-lg shadow-md md:bg-transparent md:shadow-none md:rounded-none overflow-hidden">
                    <TableCell className="p-0 md:p-4 md:table-cell md:rounded-l-lg">
                      <div className="w-full h-32 md:w-12 md:h-12 rounded-md overflow-hidden md:border md:border-gray-600">
                        {p.foto_url_prod ? (
                          <img
                            src={supabase.storage.from("produtos").getPublicUrl(p.foto_url_prod).data.publicUrl}
                            alt={p.descricao_prod}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full md:w-12 md:h-12 rounded-md bg-gray-800 flex items-center justify-center md:border-gray-600">
                            <ChefHat className="w-10 h-10 md:w-6 md:h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium p-4 md:table-cell border-t border-gray-700/50 md:border-none"><span className="font-bold text-primary md:hidden">Código: </span>{p.codigo_prod}</TableCell>
                    <TableCell className="p-4 md:table-cell border-t border-gray-700/50 md:border-none"><span className="font-bold text-primary md:hidden">Descrição: </span>{p.descricao_prod}</TableCell>
                    <TableCell className="p-4 md:table-cell border-t border-gray-700/50 md:border-none"><span className="font-bold text-primary md:hidden">Preço Venda: </span>R$ {Number(p.preco_venda_prod).toFixed(2)}</TableCell>
                    <TableCell className="p-4 md:table-cell border-t border-gray-700/50 md:border-none"><span className="font-bold text-primary md:hidden">Estoque: </span>{p.quantidade_estoque_prod}</TableCell>
                    <TableCell className="p-4 md:table-cell border-t border-gray-700/50 md:border-none"><span className="font-bold text-primary md:hidden">Cadastro: </span>{p.criado_em ? new Date(p.criado_em).toLocaleDateString() : ""}</TableCell>
                    <TableCell className="p-4 md:table-cell md:rounded-r-lg border-t border-gray-700/50 md:border-none">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openForEdit(p)} className="h-11 w-11 sm:h-9 sm:w-9 bg-[#f97316] text-white hover:bg-orange-600 border-none">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => deleteProduto(p)} className="h-11 w-11 sm:h-9 sm:w-9">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="md:table-row">
                  <TableCell colSpan={7} className="h-48 text-center text-white/70 p-0">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-[#1B1B1F] text-white border border-[#2A2A31] max-h-[95vh] overflow-hidden rounded-xl">
          <DialogHeader className="pb-2 border-b border-[#2A2A31]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={BurgerIcon} alt="Logo Burger & Cia" className="w-10 h-10" />
                  <div>
                    <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
                    <p className="text-sm text-white/70">Sistema de Controle de Produtos</p>
                  </div>
                </div>
                <DialogTitle className="text-white text-lg font-semibold">
                  {editing ? "Editar Produto" : "Inserir Produto"}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto p-4">
            {/* Coluna da foto - sempre visível */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="bg-gradient-to-br from-[#2A2A31] to-[#1B1B1F] rounded-xl p-4 border border-[#3A3A41] shadow-lg h-full">
                <div 
                  className="aspect-square w-full bg-[#252529] rounded-lg overflow-hidden border border-[#3A3A41] flex items-center justify-center cursor-pointer hover:border-yellow-400/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fotoFile ? (
                    <img src={URL.createObjectURL(fotoFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : form.foto_url_prod ? (
                    <img
                      src={supabase.storage.from("produtos").getPublicUrl(form.foto_url_prod).data.publicUrl}
                      alt={form.descricao_prod}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                      <Image className="w-16 h-16 opacity-30 mb-2" />
                      <span>Clique para adicionar uma imagem</span>
                    </div>
                  )}
                </div>
                
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)} 
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Coluna dos campos - grid responsivo */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-primary font-medium">Descrição</Label>
                <Input 
                  value={form.descricao_prod} 
                  onChange={(e) => setField("descricao_prod", e.target.value)} 
                  placeholder="Ex: X-Burger" 
                  className="bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Código do Produto</Label>
                <Input 
                  value={form.codigo_prod} 
                  onChange={(e) => setField("codigo_prod", e.target.value)} 
                  placeholder="Ex: 001" 
                  className="bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Preço de Venda</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.preco_venda_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("preco_venda_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Preço de Custo</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.preco_custo_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("preco_custo_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Preço Médio</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.preco_medio_prod || 0)} 
                  readOnly
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Preço Mínimo</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.preco_minimo_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("preco_minimo_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Quantidade em Estoque</Label>
                <Input 
                  value={form.quantidade_estoque_prod} 
                  onChange={(e) => setField("quantidade_estoque_prod", Number(e.target.value || 0))} 
                  placeholder="Ex: 100" 
                  className="bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-medium">Estoque Mínimo</Label>
                <Input 
                  value={form.estoque_minimo_prod} 
                  onChange={(e) => setField("estoque_minimo_prod", Number(e.target.value || 0))} 
                  placeholder="Ex: 10" 
                  className="bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">Despesa com ICMS</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.despesa_icms_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("despesa_icms_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-medium">Despesa com Frete</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.despesa_frete_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("despesa_frete_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-primary font-medium">Outras Despesas</Label>
                <Input 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.outras_despesas_prod || 0)} 
                  onChange={(e) => handleCurrencyChange("outras_despesas_prod", e.target.value)} 
                  placeholder="R$ 0,00" 
                  className="text-right bg-[#252529] border-[#3A3A41] hover:border-yellow-400/50 transition-colors"
                />
              </div>

            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="flex items-center justify-end w-full">
              <div className="flex items-center gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">Cancelar</Button>
                </DialogClose>
                <Button onClick={saveProduto} disabled={loading} className="bg-[#FBBF24] text-black hover:bg-[#EAB308]">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editing ? "Salvar Alterações" : "Salvar Produto"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}