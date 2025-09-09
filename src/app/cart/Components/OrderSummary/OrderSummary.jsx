import Link from "next/link";
import React from "react";
import { MdAttachMoney, MdCreditCard, MdDiscount, MdLocalShipping } from "react-icons/md";

const OrderSummary = ({subtotal, shipping, taxRate, total}) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-secondary text-base-100 rounded-3xl p-8 shadow-xl sticky top-8">
        <h3 className="text-2xl font-bold mb-6 border-b pb-4 border-base-100/40">
          Order Summary
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <MdAttachMoney /> Subtotal
            </span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <MdLocalShipping /> Shipping
            </span>
            <span className="font-semibold">${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <MdDiscount /> Tax ({taxRate * 100}%)
            </span>
            <span className="font-semibold">
              ${(subtotal * taxRate).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="border-t border-base-100/40 mt-6 pt-6">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-8 btn btn-lg w-full bg-accent text-base-100 rounded-full shadow-lg hover:scale-105 transition"
        >
          <MdCreditCard className="mr-2 text-xl" />
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
