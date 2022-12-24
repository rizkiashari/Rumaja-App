import create from 'zustand';

const useUserStore = create((set) => ({
  userData: null,
  setUserData: (user) => set((state) => ({ ...state, userData: user })),
  idPencari: null,
  setIdPencari: (id) => set((state) => ({ ...state, idPencari: id })),
  dataPekerjaan: null,
  isBoarding: true,
  setIsBoarding: (isBoarding) =>
    set((state) => ({ ...state, isBoarding: isBoarding })),
  setDataPekerjaan: (pekerjaan) =>
    set((state) => ({ ...state, dataPekerjaan: pekerjaan })),
}));

export default useUserStore;
