export const useClientContactStore = defineStore('clientContact', {
  state: () => ({
    name: '',
    email: '',
    phone: '',
  }),
  actions: {
    setFromUser(user: { name?: string; email?: string; phone?: string | null }) {
      if (user.name) this.name = user.name;
      if (user.email) this.email = user.email;
      if (user.phone) this.phone = user.phone;
    },
    setFromForm(payload: { name: string; email: string; phone: string }) {
      this.name = payload.name;
      this.email = payload.email;
      this.phone = payload.phone;
    },
  },
});
