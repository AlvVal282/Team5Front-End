// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// project import
import axios from 'utils/axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        username: { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post('/login', {
            password: credentials?.password,
            username: credentials?.username
          });
          if (user) {
            user.data.user['accessToken'] = user.data.accessToken;
            return user.data.user;
          }
        } catch (e: any) {
          console.dir(e);
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
        lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        phone: { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone Number' },
        username: { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post('/register', {
            firstname: credentials?.firstname,
            lastname: credentials?.lastname,
            email: credentials?.email,
            password: credentials?.password,
            username: credentials?.username,
            role: 1,
            phone: credentials?.phone,
          });

          console.dir(user);
          if (user) {
            user.data.user['accessToken'] = user.data.accessToken;
            return user.data.user;
          }
        } catch (e: any) {
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'reset-password',
      name: 'reset-password',
      credentials: {
        username: { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        oldPassword: { name: 'oldPassword', label: 'Old-Password', type: 'password', placeholder: 'Enter Password' },
        newPassword: { name: 'newPassword', label: 'New-Password', type: 'password', placeholder: 'Enter New Password' },
      },
      async authorize(credentials) {
        try {
          const user = await axios.put('/change-password', {
            username: credentials?.username,
            oldPassword: credentials?.oldPassword,
            newPassword: credentials?.newPassword,
          });
          if (user.data?.message) {
            console.log(user.data?.message)
            return { message: user.data?.message, username: credentials?.username };
          } else {
            throw new Error('Password reset failed');
          }

        } catch (e: any) {
          console.log(credentials?.newPassword)
          console.dir(e);
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};
