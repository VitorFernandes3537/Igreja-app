-- CreateTable
CREATE TABLE `usuario` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Atualizado_em` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    INDEX `usuario_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `igreja` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Atualizado_em` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `igreja_usuario` (
    `id` VARCHAR(191) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `igreja_id` VARCHAR(191) NOT NULL,
    `role` ENUM('pastor', 'secretaria', 'dev', 'membro') NOT NULL DEFAULT 'membro',
    `pode_delete` BOOLEAN NOT NULL DEFAULT false,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Atualizado_em` DATETIME(3) NOT NULL,

    INDEX `igreja_usuario_usuario_id_idx`(`usuario_id`),
    INDEX `igreja_usuario_igreja_id_idx`(`igreja_id`),
    UNIQUE INDEX `igreja_usuario_usuario_id_igreja_id_key`(`usuario_id`, `igreja_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro` (
    `id` VARCHAR(191) NOT NULL,
    `igreja_id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `status` ENUM('ativo', 'inativo', 'suspenso') NOT NULL DEFAULT 'ativo',
    `aniver_data` DATETIME(3) NULL,
    `Telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NULL,
    `deletado_em` DATETIME(3) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Atualizado_em` DATETIME(3) NOT NULL,

    UNIQUE INDEX `membro_email_key`(`email`),
    UNIQUE INDEX `membro_cpf_key`(`cpf`),
    INDEX `membro_igreja_id_idx`(`igreja_id`),
    INDEX `membro_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_auditoria` (
    `id` VARCHAR(191) NOT NULL,
    `usuario_id` VARCHAR(191) NULL,
    `igreja_id` VARCHAR(191) NULL,
    `acao` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `logs_auditoria_usuario_id_idx`(`usuario_id`),
    INDEX `logs_auditoria_igreja_id_idx`(`igreja_id`),
    INDEX `logs_auditoria_acao_idx`(`acao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `igreja_usuario` ADD CONSTRAINT `igreja_usuario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `igreja_usuario` ADD CONSTRAINT `igreja_usuario_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro` ADD CONSTRAINT `membro_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs_auditoria` ADD CONSTRAINT `logs_auditoria_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs_auditoria` ADD CONSTRAINT `logs_auditoria_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
