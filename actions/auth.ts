"use server";

import { signIn } from "@/lib/auth";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const LoginAction = async (formData: FormData) => {
  try {
    const validate = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!validate.success) {
      return {
        message: validate.error.issues[0].message,
        success: false,
      };
    }

    const { email, password } = validate.data;

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      return {
        success: false,
        message: "Email atau Password salah!",
      };
    }

    return {
      success: true,
      message: "Login berhasil!",
    };
  } catch (error) {
    console.log("GAGAL LOGIN: ", error);

    // error dari NextAuth
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Email atau Password salah!" };
        default:
          return {
            success: false,
            message: "Kesalahan pada server, coba lagi!",
          };
      }
    }

    // lempar error ke client
    throw error;
  }
};

export const RegisterAction = async (formData: FormData) => {
  try {
    const vaidate = RegisterSchema.safeParse(Object.fromEntries(formData));

    if (!vaidate.success) {
      return {
        success: false,
        message: vaidate.error.issues[0].message,
      };
    }

    const { name, email, password } = vaidate.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar, gunakan email lain!",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Registrasi berhasil!",
      data: createdUser,
    };
  } catch (error) {
    console.log("GAGAL REGISTER: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email sudah terdaftar, gunakan email lain!",
        };
      }
    }

    return {
      success: false,
      message: "Kesalahan pada server, coba lagi!",
    };
  }
};
