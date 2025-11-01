"use client";

export const Main = () => {

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (!accessToken) {
  //     router.push('/login');
  //   }
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (!refreshToken) {
  //     router.push('/login');
  //   }
  //   const user = localStorage.getItem('user');
  //   if (!user) {
  //     router.push('/login');
  //   }

  // }, [router])

  return (
    <main className="flex-1 p-4">
      <h1>Welcome to Tailor Track!</h1>
      <p>This is the main content area.</p>
    </main>
  );
};
