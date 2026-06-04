"use client"
import { createTransaction, updateTransaction } from '@/actions/transaction'
import { transactionSchema } from '@/app/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useFetch from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar";
import { Switch } from '@/components/ui/switch'
import { useRouter, useSearchParams } from 'next/navigation'
import ReciptScanner from './recipt-scanner'



const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,


}) => {
  const router= useRouter()
  const searchParams= useSearchParams();
  const editId = searchParams.get("edit");

  
     const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  }=useForm({

     resolver: zodResolver(transactionSchema),

      defaultValues:
      editMode && initialData ?
      {
        type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,

      }),
    }
      
     : {
  type: "EXPENSE",
  amount: undefined,
  description: "",
  accountId: accounts.find((ac) => ac.isDefault)?.id,
  date: new Date().toISOString().split("T")[0],
  isRecurring: false,
  category: "",
}


    })
useEffect(() => {
  register("date");
  register("category");
}, [register]);
    

    const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const amount = watch("amount");

useEffect(() => {
  console.log("Amount:", amount);
}, [amount]);

const onSubmit = async (data) => {
  console.log("SUBMIT DATA:", data);
   alert("Form submitted");

    if (editMode) {
      transactionFn(editId, data);
    } else {
  transactionFn(data);
};
}

useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);



  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const handleScanComplete=(scannedData) => {
    if(scannedData){
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));

       if (scannedData.description) {
        setValue("description", scannedData.description);
      }

       if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  return (
    <form className='space-y-2' onSubmit={handleSubmit(onSubmit)}>

        {/*/  AI RECIPT SCANNER*/}
  {!editMode && <ReciptScanner onScanComplete={handleScanComplete} />}

        <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

        {/* Amount and Account */}

               <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
      
  
<Input
  type="number"
  step="0.01"
  placeholder="0.00"
  onChange={(e) => setValue("amount", Number(e.target.value))}
 />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

       <div className="space-y-2">
  <label className="text-sm font-medium">Account</label>

  <div className="flex gap-2">

    <Select
      onValueChange={(value) => setValue("accountId", value)}
      defaultValue={getValues("accountId")}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select account" />
      </SelectTrigger>

      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name} (${parseFloat(account.balance).toFixed(2)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <CreateAccountDrawer>
      <Button type="button" variant="outline">
        Create Account
      </Button>
    </CreateAccountDrawer>

  </div>

  {errors.accountId && (
    <p className="text-sm text-red-500">{errors.accountId.message}</p>
  )}


</div>
   </div>

    {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-60 overflow-y-auto"
           side="bottom"
             sideOffset={5}
             avoidCollisions={false}>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
     <div className="space-y-2">
  <label className="text-sm font-medium">Date</label>

  <Input
    type="date"
    value={watch("date") || ""}
    onChange={(e) => setValue("date", e.target.value)}
  />

  {errors.date && (
    <p className="text-sm text-red-500">{errors.date.message}</p>
  )}
</div>
 {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

   {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

       {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent 
             className="bg-white z-50"
            side="bottom"
             sideOffset={5}
              >
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      
     {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full bg-black text-white border border-black hover:bg-neutral-800" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}
export default AddTransactionForm