export interface User {
  id: string;
  openid?: string;
  nickname?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userInfo: WechatUserInfo | null;
}

export interface WechatUserInfo {
  openid: string;
  nickname?: string;
  avatarUrl?: string;
}
