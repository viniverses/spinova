import { i18n } from "@better-auth/i18n";

export const authI18n = i18n({
  translations: {
    "pt-BR": {
      USER_NOT_FOUND: "Usuário não encontrado",
      FAILED_TO_CREATE_USER: "Falha ao criar usuário",
      FAILED_TO_UPDATE_USER: "Falha ao atualizar usuário",
      USER_ALREADY_EXISTS: "Usuário já existe",
      USER_EMAIL_NOT_FOUND: "Email do usuário não encontrado",
      USER_ALREADY_HAS_PASSWORD:
        "Usuário já possui uma senha. Forneça-a para excluir a conta.",
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        "Usuário já existe. Use outro email.",

      // Session related errors
      FAILED_TO_CREATE_SESSION: "Falha ao criar sessão",
      FAILED_TO_GET_SESSION: "Falha ao obter sessão",
      SESSION_EXPIRED:
        "Sessão expirada. Autentique-se novamente para realizar esta ação.",

      // Authentication errors
      INVALID_PASSWORD: "Senha inválida",
      INVALID_EMAIL: "Email inválido",
      INVALID_EMAIL_OR_PASSWORD: "Email ou senha inválidos",
      INVALID_TOKEN: "Token inválido",
      EMAIL_NOT_VERIFIED: "Email não verificado",
      CREDENTIAL_ACCOUNT_NOT_FOUND: "Conta de credenciais não encontrada",

      // Password related errors
      PASSWORD_TOO_SHORT: "Senha muito curta",
      PASSWORD_TOO_LONG: "Senha muito longa",

      // Social auth errors
      SOCIAL_ACCOUNT_ALREADY_LINKED: "Conta já vinculada",
      PROVIDER_NOT_FOUND: "Provedor não encontrado",
      ID_TOKEN_NOT_SUPPORTED: "id_token não suportado",
      FAILED_TO_GET_USER_INFO: "Falha ao obter informações do usuário",

      // Account management errors
      EMAIL_CAN_NOT_BE_UPDATED: "Email não pode ser atualizado",
      FAILED_TO_UNLINK_LAST_ACCOUNT:
        "Você não pode desvincular sua última conta",
      ACCOUNT_NOT_FOUND: "Conta não encontrada",
    },
  },
  detection: ["header", "cookie", "session"],
});
