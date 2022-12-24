import create from 'zustand';

const useAuthStore = create((set) => ({
  isLogin: false,
  setIsLogin: (login) =>
    set((state) => {
      return { ...state, isLogin: login };
    }),
}));

export default useAuthStore;
