import { Request, Response } from 'express';
import prisma from '@/lib/prisma';

interface CriarMembroBody {
  igreja_id: string;
  nome: string;
  email?: string | null;
  cpf?: string | null;
  aniver_data?: string | null;
  telefone: string;
  endereco?: string | null;
}

// LISTAR
export async function listar(_req: Request, res: Response): Promise<Response> {
  try {
    const membro = await prisma.membro.findMany({
      where: { deletado_em: null },
      orderBy: { criado_em: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        igreja_id: true,
        criado_em: true
      }
    });

    return res.json({ data: membro });
  } catch (erro) {
    console.error('erro ao listar membros: ', erro);
    return res
      .status(500)
      .json({ error: 'erro as listar membros', erro });
  }
}

// CRIAR
export async function criar(
  req: Request<unknown, unknown, CriarMembroBody>,
  res: Response
): Promise<Response> {
  try {
    const {
      igreja_id,
      nome,
      email,
      cpf,
      aniver_data,
      telefone,
      endereco
    } = req.body;

    if (!igreja_id || !nome) {
      return res
        .status(400)
        .json({ error: 'Igreja_id ou Nome são obrigatórios' });
    }

    const igreja = await prisma.igreja.findUnique({
      where: { id: igreja_id }
    });

    if (!igreja) {
      return res
        .status(404)
        .json({ error: 'Igreja não encontrada' });
    }

    const membro = await prisma.membro.create({
      data: {
        igreja_id,
        nome,
        email: email ?? null,
        cpf: cpf ?? null,
        aniver_data: aniver_data ? new Date(aniver_data) : null,
        telefone: telefone,
        endereco: endereco ?? null,
        status: 'ativo'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        igreja_id: true,
        criado_em: true
      }
    });

    await prisma.logs_auditoria.create({
      data: {
        igreja_id,
        acao: 'membro.create',
        descricao: `Criou um membro ${membro.nome} (${membro.id})`
      }
    });

    return res.status(201).json({ data: membro });
  } catch (erro: any) {
    console.error('erro ao criar membro: ', erro);

    if (erro?.code === 'P2002') {
      return res.status(409).json({
        error: 'Campo único já existente (email ou cpf)'
      });
    }

    return res
      .status(500)
      .json({ error: 'Erro ao criar membro', erro });
  }
}

export default { listar, criar };