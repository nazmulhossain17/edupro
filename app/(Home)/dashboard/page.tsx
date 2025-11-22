'use client'

import { authClient } from "@/lib/auth-client"

 function DashboardPage() {
    const signOut = async() =>{
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () =>{
                    alert("Signed out successfully")
                }
            }
        })
    }
  return (
    <div className="flex flex-col gap-4 ">
        <h1>Dashboard</h1>
        <button onClick={signOut}>Sign out</button>
    </div>
  )
}

export default DashboardPage