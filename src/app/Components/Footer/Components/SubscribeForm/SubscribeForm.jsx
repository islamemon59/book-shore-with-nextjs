"use client";

import { useState } from "react";
import { toast } from 'react-hot-toast';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for validation
const subscribeSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(subscribeSchema),
  });

  const handleSubscribe = async (data) => {
    setLoading(true);
    try {
      // Placeholder for your actual subscription logic
      // e.g., await api.subscribe(data.email);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      toast.success("Thank you for subscribing!");
      reset(); // Reset form after successful submission
    } catch (error) {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubscribe)} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
      <div className="flex-grow w-full">
        <input
          type="email"
          placeholder="Enter your email"
          className={`input input-bordered w-full transition-colors duration-200 ${
            errors.email ? "input-error" : ""
          }`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-error text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full sm:w-auto"
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}