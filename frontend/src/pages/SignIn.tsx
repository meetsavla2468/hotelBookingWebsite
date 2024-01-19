import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
      <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-5xl font-bold text-center mb-10">Sign In</h2>
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border border-black rounded-lg p-3"
          {...register("email", { required: "This field is required" })}
          ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
          )}
        <input
          type="password"
          placeholder="password"
          className="border border-black rounded-lg p-3"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
          )}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
          Login
        </button>
      <span className="flex gap-2 mt-5">
        <span className="text-sm">
          Dont have an account?{" "}
          <Link className="text-blue-700" to="/register">
            Sign Up
          </Link>
        </span>
        
      </span>
    </form>
        </div>
  );
};

export default SignIn;
