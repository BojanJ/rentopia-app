import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

// Validation schema
const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  firstName: z
    .string()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
  role: z
    .enum(["PROPERTY_OWNER", "TENANT", "SERVICE_PROVIDER"], {
      message: "Please select your role",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Helper function to extract error message
const getErrorMessage = (error: Error): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data: { message: string } } };
    return axiosError.response?.data?.message || error.message;
  }
  return error.message || "An unexpected error occurred";
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedRole = watch("role");

  // Redirect if already authenticated - use useEffect to prevent reloading on errors
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Join Rentopia and start managing your properties
        </p>
      </div>
      
      {registerMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {getErrorMessage(registerMutation.error)}
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              disabled={registerMutation.isPending}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              disabled={registerMutation.isPending}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            disabled={registerMutation.isPending}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={watchedRole} 
            onValueChange={(value) => setValue("role", value as RegisterFormData["role"])} 
            disabled={registerMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROPERTY_OWNER">Property Owner</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            disabled={registerMutation.isPending}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            disabled={registerMutation.isPending}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      
      <Separator />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate("/auth/login")}
            disabled={registerMutation.isPending}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
}
