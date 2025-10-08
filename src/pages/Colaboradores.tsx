import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Users, Edit, Trash2, Plus, Calendar, Clock, ChefHat } from "lucide-react";
import BurgerIcon from "@/assets/burger-icon.svg";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { useToast } from "@/hooks/use-toast";
import { maskCPF, maskRG } from "@/lib/masks";

interface Colaborador {
  id: string;
  nome_cola: string;
  email_cola: string;
  cargo_cola: string;
  datanas_cola: string;
  Cpf_cola: string;
  Rg_cola: string;
  Endereco_cola: string;
  Bairro_cola: string;
  cidade_cola: string;
  Uf_cola: string;
  criado_em: string;
}

const initialFormData = {
  nome_cola: "",
  email_cola: "",
  cargo_cola: "",
  datanas_cola: "",
  Cpf_cola: "",
  Rg_cola: "",
  Endereco_cola: "",
  Bairro_cola: "",
  cidade_cola: "",
  Uf_cola: "",
};

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCargo, setFilterCargo] = useState<string>("todos");
  const [currentTime, setCurrentTime] = useState(new Date());

  const filteredColaboradores = filterCargo === "todos"
    ? colaboradores
    : colaboradores.filter((c) => c.cargo_cola === filterCargo);

  const isEdit = !!selectedColaborador;
  const updateField = (key: keyof typeof initialFormData, value: string) => {
    if (isEdit && selectedColaborador) {
      setSelectedColaborador({ ...selectedColaborador, [key]: value } as any);
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchColaboradores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, nome_cola, email_cola, cargo_cola, datanas_cola, Cpf_cola, Rg_cola, Endereco_cola, Bairro_cola, cidade_cola, Uf_cola, criado_em')
        .order('criado_em', { ascending: false });
      if (error) {
        throw error;
      }
      setColaboradores(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar colaboradores:", error);
      toast({ 
        title: "Erro ao carregar dados", 
        description: `Não foi possível buscar a lista de colaboradores: ${error.message}`,
        variant: "destructive",
        duration: 9000,
      });
      setColaboradores([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const handleAddColaborador = async () => {
    for (const key in formData) {
      if ((formData as any)[key] === "") {
        toast({ title: "Erro de Validação", description: `O campo ${key.replace(/_/g, ' ')} é obrigatório.`, variant: "destructive" });
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        Cpf_cola: formData.Cpf_cola.replace(/\D/g, ''),
        Rg_cola: formData.Rg_cola.replace(/\D/g, ''),
      };
      const { data, error } = await supabase.from("colaboradores").insert([payload]).select();
      if (error) throw error;
      if (data) {
        fetchColaboradores();
        setFormData(initialFormData);
        setIsDialogOpen(false);
        toast({ title: "Colaborador adicionado com sucesso" });
      }
    } catch (error) {
      const err = error as Error;
      toast({ title: "Erro ao adicionar colaborador", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateColaborador = async () => {
    if (!selectedColaborador) return;
    try {
      const payload = {
        ...selectedColaborador,
        Cpf_cola: selectedColaborador.Cpf_cola.replace(/\D/g, ''),
        Rg_cola: selectedColaborador.Rg_cola.replace(/\D/g, ''),
      };
      const { error } = await supabase.from("colaboradores").update(payload).eq("id", selectedColaborador.id);
      if (error) throw error;
      fetchColaboradores();
      setIsDialogOpen(false);
      toast({ title: "Colaborador atualizado com sucesso" });
    } catch (error) {
      const err = error as Error;
      toast({ title: "Erro ao atualizar colaborador", description: err.message, variant: "destructive" });
    }
  };

  const excluirColaborador = async (id: string) => {
    try {
      const { error } = await supabase.from("colaboradores").delete().eq("id", id);
      if (error) throw error;
      setColaboradores(colaboradores.filter((c) => c.id !== id));
      toast({ title: "Colaborador excluído com sucesso" });
    } catch (error) {
      const err = error as Error;
      toast({ title: "Erro ao excluir colaborador", description: err.message, variant: "destructive" });
    }
  };

  const openEditDialog = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedColaborador(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 space-y-6">

      <Card className="bg-[#1e1e1e] border border-gray-700">
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <img src={BurgerIcon} alt="Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Lista de Colaboradores ({filteredColaboradores.length})</h3>
                  <p className="text-xs text-gray-400">Gerencie os colaboradores cadastrados</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{currentTime.toLocaleDateString()}</span>
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filterCargo} onValueChange={setFilterCargo}>
                  <SelectTrigger className="bg-[#121212] border-gray-600 text-white w-[180px]">
                    <SelectValue placeholder="Filtrar por cargo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] text-white border-gray-700">
                    <SelectItem value="todos">Todos os Cargos</SelectItem>
                    <SelectItem value="Funcionário">Funcionário</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Atendente">Atendente</SelectItem>
                    <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-[#f5b301] text-black hover:bg-yellow-400" onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" /> Inserir Colaborador
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-400">Carregando...</p>
          ) : filteredColaboradores.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow className="border-b border-gray-700">
                    <TableHead className="text-[#f5b301]">Nome</TableHead>
                    <TableHead className="text-[#f5b301]">Cargo</TableHead>
                    <TableHead className="text-[#f5b301]">E-mail</TableHead>
                    <TableHead className="text-[#f5b301]">Data de Cadastro</TableHead>
                    <TableHead className="text-[#f5b301]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id} className="mb-4 flex flex-col rounded-lg border border-gray-800 p-4 md:table-row md:rounded-none md:border-0 md:p-0 md:border-b">
                      <TableCell className="flex items-center justify-between border-b border-gray-700 pb-2 font-medium md:table-cell md:border-none md:pb-4">
                        <span className="text-sm font-semibold text-[#f5b301] md:hidden">Nome</span>
                        <span>{colaborador.nome_cola}</span>
                      </TableCell>
                      <TableCell className="flex items-center justify-between border-b border-gray-700 py-2 md:table-cell md:border-none md:py-4">
                        <span className="text-sm font-semibold text-[#f5b301] md:hidden">Cargo</span>
                        <span>{colaborador.cargo_cola}</span>
                      </TableCell>
                      <TableCell className="flex items-center justify-between border-b border-gray-700 py-2 md:table-cell md:border-none md:py-4">
                        <span className="text-sm font-semibold text-[#f5b301] md:hidden">E-mail</span>
                        <span>{colaborador.email_cola}</span>
                      </TableCell>
                      <TableCell className="flex items-center justify-between border-b border-gray-700 py-2 md:table-cell md:border-none md:py-4">
                        <span className="text-sm font-semibold text-[#f5b301] md:hidden">Data de Cadastro</span>
                        <span>{new Date(colaborador.criado_em).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="flex items-center justify-between pt-2 md:table-cell md:pt-4">
                        <span className="text-sm font-semibold text-[#f5b301] md:hidden">Ações</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-orange-500 text-white hover:bg-orange-600 border-none"
                            onClick={() => openEditDialog(colaborador)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-700 border-none"
                            onClick={() => excluirColaborador(colaborador.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum colaborador cadastrado para o filtro selecionado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] text-white border-gray-700 md:max-w-3xl">
          <DialogHeader>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-10 h-10 text-[#f5b301]" />
                    <div>
                      <h2 className="text-lg font-bold text-white">Controle de Colaboradores</h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">Sistema de Controle de Funcionários</p>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{currentTime.toLocaleDateString()}</span>
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
              <DialogTitle className="text-white text-lg font-semibold border-t border-border pt-2">
                {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nome_cola" className="text-gray-300">Nome Completo</Label>
                <Input id="edit_nome_cola" value={isEdit ? (selectedColaborador as Colaborador).nome_cola : formData.nome_cola} onChange={(e) => updateField('nome_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email_cola" className="text-gray-300">E-mail</Label>
                <Input id="edit_email_cola" type="email" value={isEdit ? (selectedColaborador as Colaborador).email_cola : formData.email_cola} onChange={(e) => updateField('email_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cargo_cola" className="text-gray-300">Cargo</Label>
                <Select onValueChange={(value) => updateField('cargo_cola', value)} value={isEdit ? (selectedColaborador as Colaborador).cargo_cola : formData.cargo_cola}>
                  <SelectTrigger className="bg-[#121212] border-gray-600 focus:border-[#f5b301]">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] text-white border-gray-700">
                    <SelectItem value="Funcionário">Funcionário</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Atendente">Atendente</SelectItem>
                    <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_datanas_cola" className="text-gray-300">Data de Nascimento</Label>
                <Input id="edit_datanas_cola" type="date" value={isEdit ? (selectedColaborador as Colaborador).datanas_cola : formData.datanas_cola} onChange={(e) => updateField('datanas_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_Cpf_cola" className="text-gray-300">CPF</Label>
                <Input id="edit_Cpf_cola" value={isEdit ? (selectedColaborador as Colaborador).Cpf_cola : formData.Cpf_cola} onChange={(e) => updateField('Cpf_cola', maskCPF(e.target.value))} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
            </div>
            {/* Coluna 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_Rg_cola" className="text-gray-300">RG</Label>
                <Input id="edit_Rg_cola" value={isEdit ? (selectedColaborador as Colaborador).Rg_cola : formData.Rg_cola} onChange={(e) => updateField('Rg_cola', maskRG(e.target.value))} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_Endereco_cola" className="text-gray-300">Endereço</Label>
                <Input id="edit_Endereco_cola" value={isEdit ? (selectedColaborador as Colaborador).Endereco_cola : formData.Endereco_cola} onChange={(e) => updateField('Endereco_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_Bairro_cola" className="text-gray-300">Bairro</Label>
                <Input id="edit_Bairro_cola" value={isEdit ? (selectedColaborador as Colaborador).Bairro_cola : formData.Bairro_cola} onChange={(e) => updateField('Bairro_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cidade_cola" className="text-gray-300">Cidade</Label>
                <Input id="edit_cidade_cola" value={isEdit ? (selectedColaborador as Colaborador).cidade_cola : formData.cidade_cola} onChange={(e) => updateField('cidade_cola', e.target.value)} className="bg-[#121212] border-gray-600 focus:border-[#f5b301] focus:ring-[#f5b301]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_Uf_cola" className="text-gray-300">UF</Label>
                <Select onValueChange={(value) => updateField('Uf_cola', value)} value={isEdit ? (selectedColaborador as Colaborador).Uf_cola : formData.Uf_cola}>
                  <SelectTrigger className="bg-[#121212] border-gray-600 focus:border-[#f5b301]">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] text-white border-gray-700">
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{currentTime.toLocaleDateString()}</span>
                <Clock className="w-4 h-4 text-primary" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="bg-gray-600 hover:bg-gray-700">Cancelar</Button>
                </DialogClose>
                <Button onClick={isEdit ? handleUpdateColaborador : handleAddColaborador} className="bg-[#f5b301] text-black hover:bg-yellow-400">
                  {isEdit ? 'Salvar Alterações' : 'Salvar Funcionário'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
