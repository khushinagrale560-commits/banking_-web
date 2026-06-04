
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import useFetch from "@/hooks/use-fetch";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),

    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
  await createAccountFn(data);
};

useEffect(() => {
  if (newAccount) {
    toast.success("Account created successfully");
    reset();
    setOpen(false);
  }
}, [newAccount, reset]);

useEffect(() => {
  if (error) {
    toast.error(error.message || "Failed to create account");
  }
}, [error]);

  

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="bg-white px-4">
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>

        <div className="pb-4">
          
  <form 
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-4 pb-40"
    
  >

           <div className="space-y-2">
  <label>Account Name</label>

  <input
    type="text"
    placeholder="Main Checking"
    className="w-full border rounded-md p-2"
    {...register("name")}
  />

  {errors.name && (
    <p className="text-red-500 text-sm">
      {errors.name.message}
    </p>
  )}
</div>
            <div className="space-y-2">
              <label>Account Type</label>

              <Select
                value={watch("type")}
                onValueChange={(value) =>
                  setValue("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CURRENT">
                    Current
                  </SelectItem>

                  <SelectItem value="SAVINGS">
                    Savings
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Initial Balance</label>

              <input
  type="number"
  step="0.01"
  className="w-full border rounded-md p-2"
  {...register("balance", {
    valueAsNumber: true,
  })}
/>

              {errors.balance && (
                <p className="text-red-500 text-sm">
                  {errors.balance.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium">Set as Default</p>

                <p className="text-sm text-muted-foreground">
                  Default account for transactions
                </p>
              </div>

              <Switch
                checked={watch("isDefault")}
                onCheckedChange={(checked) =>
                  setValue("isDefault", checked)
                }
              />
            </div>

            <div className="flex gap-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                className="flex-1"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateAccountDrawer;

