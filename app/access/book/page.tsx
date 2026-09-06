"use client";

import { Suspense } from "react";
import { AccessBooking } from "@/components/access/AccessBooking";

export default function AccessBookPage(){
  return <Suspense fallback={<p className="text-sm text-taupe">Loading booking...</p>}><AccessBooking/></Suspense>;
}
