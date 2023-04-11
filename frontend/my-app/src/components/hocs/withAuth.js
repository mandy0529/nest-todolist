import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      console.log(token, 'token!!!!!!!!!!!');

      if (!token) {
        router.push('/signin');
      }
    }, [router]);

    return <Component {...props} />;
  };
}
