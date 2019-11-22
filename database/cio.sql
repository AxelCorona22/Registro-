IF OBJECT_ID('alumnos', 'U') IS NOT NULL
DROP TABLE alumnos
--GO
CREATE TABLE alumnos
(
    [id] INT IDENTITY(1,1) PRIMARY KEY,

    [emailAddress] NVARCHAR(100) NOT NULL,--#TODOs:agregar indice unico
    [password] NVARCHAR(100) NOT NULL,
    [nick] NVARCHAR(30) NOT NULL,
    [fullName] NVARCHAR(150) NOT NULL,
    [celular] NVARCHAR(10) NULL,

    [updatedAt] DATETIME NULL DEFAULT NULL,
    [createdAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
);


-- ██    ██ ███████ ██    ██  █████  ██████  ██  ██████  ███████
-- ██    ██ ██      ██    ██ ██   ██ ██   ██ ██ ██    ██ ██
-- ██    ██ ███████ ██    ██ ███████ ██████  ██ ██    ██ ███████
-- ██    ██      ██ ██    ██ ██   ██ ██   ██ ██ ██    ██      ██
--  ██████  ███████  ██████  ██   ██ ██   ██ ██  ██████  ███████
IF OBJECT_ID('usuarios', 'U') IS NOT NULL
DROP TABLE usuarios
--GO
CREATE TABLE usuarios
(
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [activo] BIT DEFAULT 0,
    [tos] BIT DEFAULT 0,
    [online] BIT DEFAULT 0,
    [uuid] NVARCHAR(100) NULL,
    [socket] NVARCHAR(32) NULL DEFAULT NULL,
    [movilOnly] BIT DEFAULT 0,
    [isSuperAdmin] BIT DEFAULT 0,
    [perfilName] NVARCHAR(20) NOT NULL,
    [mfa] NVARCHAR(4000) DEFAULT '',
    [permisos] NVARCHAR(4000) DEFAULT '[]',
    [device] NVARCHAR(4000) DEFAULT '[]',
    [emailAddress] NVARCHAR(100) NOT NULL,--#TODOs:agregar indice unico
    [password] NVARCHAR(100) NOT NULL,
    [clearPassword] NVARCHAR(50) DEFAULT '',
    [fullName] NVARCHAR(150) NOT NULL,
    [pushId] NVARCHAR(36) NULL,
    [movilAccess] BIT DEFAULT 0,
    [disabled] BIT DEFAULT 0,
    [celular] NVARCHAR(15) NULL,
    [celularStatus] NVARCHAR(30) DEFAULT 'unconfirmed',
    [imageUploadFd] NVARCHAR(200) NULL,
    [imageUploadMime] NVARCHAR(50) NULL,
    [passwordResetToken] NVARCHAR(150) NULL,
    [passwordResetTokenExpiresAt] DATETIME NULL,
    [emailProofToken] NVARCHAR(150) NULL,
    [emailProofTokenExpiresAt] DATETIME NULL,
    [emailStatus] NVARCHAR(30) NULL,
    [emailChangeCandidate] NVARCHAR(100) NULL,

    [perfil] INT NOT NULL,

    [tokenSMS] NVARCHAR(6) NULL,
    [expiracionTokenSMS] DATETIME NULL DEFAULT NULL,

    [updatedAt] DATETIME NULL DEFAULT NULL,
    [createdAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
    [lastSeenAt] DATETIME NULL DEFAULT NULL,
);
--GO
-- ██████  ███████ ██████  ███████ ██ ██      ███████ ███████
-- ██   ██ ██      ██   ██ ██      ██ ██      ██      ██
-- ██████  █████   ██████  █████   ██ ██      █████   ███████
-- ██      ██      ██   ██ ██      ██ ██      ██           ██
-- ██      ███████ ██   ██ ██      ██ ███████ ███████ ███████
IF OBJECT_ID('perfiles', 'U') IS NOT NULL
DROP TABLE perfiles
--GO
CREATE TABLE perfiles
(
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [nombre] NVARCHAR(50),
    [permisos] NVARCHAR(4000),
    [descripcion] NVARCHAR(250),
    [visible] BIT DEFAULT 0,

    [updatedAt] DATETIME NULL DEFAULT NULL,
    [createdAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
);
--GO
IF OBJECT_ID('permisos', 'U') IS NOT NULL
DROP TABLE permisos
--GO
-- ██████  ███████ ██████  ███    ███ ██ ███████  ██████  ███████
-- ██   ██ ██      ██   ██ ████  ████ ██ ██      ██    ██ ██
-- ██████  █████   ██████  ██ ████ ██ ██ ███████ ██    ██ ███████
-- ██      ██      ██   ██ ██  ██  ██ ██      ██ ██    ██      ██
-- ██      ███████ ██   ██ ██      ██ ██ ███████  ██████  ███████
CREATE TABLE permisos
(
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [nombre] NVARCHAR(30) NOT NULL,
    [categoria] NVARCHAR(30) NOT NULL,
    [descripcion] NVARCHAR(100),
    [valor] NVARCHAR(30) NOT NULL,
    [estatus] BIT DEFAULT 1,

    [updatedAt] DATETIME NULL DEFAULT NULL,
    [createdAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
);



--  ██████  ██████  ███    ██ ███████ ████████ ██████   █████  ██ ███    ██ ████████ ███████
-- ██      ██    ██ ████   ██ ██         ██    ██   ██ ██   ██ ██ ████   ██    ██    ██
-- ██      ██    ██ ██ ██  ██ ███████    ██    ██████  ███████ ██ ██ ██  ██    ██    ███████
-- ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██   ██ ██ ██  ██ ██    ██         ██
--  ██████  ██████  ██   ████ ███████    ██    ██   ██ ██   ██ ██ ██   ████    ██    ███████


    ALTER TABLE usuarios ADD FOREIGN KEY (perfil) REFERENCES perfiles(id);

ALTER TABLE perfiles ADD CONSTRAINT [El campo permisos de perfiles debe ser formato JSON] CHECK (ISJSON(permisos)=1);
ALTER TABLE usuarios ADD CONSTRAINT [El campo device de usuarios debe ser formato JSON] CHECK (ISJSON(device)=1);
ALTER TABLE usuarios ADD CONSTRAINT [El campo mfa debe ser formato JSON] CHECK (ISJSON(mfa)=1);
ALTER TABLE usuarios ADD CONSTRAINT [El campo permisos de user debe ser formato JSON] CHECK (ISJSON(permisos)=1);
--GO
