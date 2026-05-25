export interface UserPayload {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const authService = {
  register: async (payload: { name: string; email: string; password: string; avatar?: string }) => {
    void payload;
    return { token: 'runtime-token', user: { id: 'local', name: payload.name, email: payload.email, avatar: payload.avatar ?? '' } };
  },
  login: async (payload: { email: string; password: string }) => {
    void payload;
    return { token: 'runtime-token', user: { id: 'local', name: 'Explorer', email: payload.email, avatar: '' } };
  },
  me: async () => {
    return { user: { id: 'local', name: 'Explorer', email: 'local@runtime.app', avatar: '' } };
  },
  updateProfile: async (payload: { name?: string; avatar?: string }) => {
    void payload;
    return { user: { id: 'local', name: payload.name ?? 'Explorer', email: 'local@runtime.app', avatar: payload.avatar ?? '' } };
  },
};
