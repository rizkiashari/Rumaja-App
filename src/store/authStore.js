import create from 'zustand';

const useAuthStore = create((set) => ({
  isLogin: false,
  splashScreen: true,
  setIsLogin: (login) =>
    set((state) => {
      return { ...state, isLogin: login };
    }),
  setSplashScreen: (splash) =>
    set((state) => {
      return { ...state, splashScreen: splash };
    }),
}));

export default useAuthStore;
