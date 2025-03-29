// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Loader from "../ui/Loader";
// import { Transaction } from "@/utils/mockData";

// interface SettleDebtsCardProps {
//   transactions: Transaction[];
//   onSettle: () => Promise<void>;
//   isSettling: boolean;
//   currency: { symbol: string };
//   memberMap: { [key: string]: { name: string; email: string } };
// }



// // Helper function to safely format the amount
// const formatAmount = (amount: string | number): string => {
//   let parsed: number;
//   if (typeof amount === "number") {
//     parsed = amount;
//   } else {
//     parsed = parseFloat(amount);
//   }
//   // Check if parsed is a valid number
//   if (isNaN(parsed)) {
//     return "0.00";
//   }
//   return parsed.toFixed(2);
// };

// export const SettleDebtsCard = ({
//   transactions,
//   onSettle,
//   isSettling,
//   currency,
//   memberMap,
// }: SettleDebtsCardProps) => {
//   const getDisplayName = (id: string) => {
//     // Lookup the member from the map and only return the email.
//     const member = memberMap[id];
//     return member && member.email ? member.email : "Unknown User";
//   };

//   return (
//     <Card className="border-none shadow-subtle">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-xl">Settle Group Debts</CardTitle>
//         <Button onClick={onSettle} disabled={isSettling} className="rounded-md">
//           {isSettling ? (
//             <>
//               <Loader size="sm" className="mr-2" />
//               Calculating...
//             </>
//           ) : (
//             "Settle Debts"
//           )}
//         </Button>
//       </CardHeader>

//       <CardContent>
//         {transactions.length === 0 ? (
//           <div className="text-center text-muted-foreground py-8">
//             No settlement transactions yet. Click "Settle Debts" to calculate who owes whom.
//           </div>
//         ) : (
//           <div className="space-y-2">
//             <div className="grid grid-cols-3 font-medium text-sm text-muted-foreground pb-2 border-b">
//               <span>From</span>
//               <span className="text-center">To</span>
//               <span className="text-right">Amount</span>
//             </div>
//             {transactions.map((tx) => (
//               <div
//                 key={tx.TransactionID}
//                 className="grid grid-cols-3 items-center py-2"
//               >
//                 <span className="truncate">{getDisplayName(tx.From)}</span>
//                 <span className="text-center truncate">
//                   {getDisplayName(tx.To)}
//                 </span>
//                 <span className="text-right font-medium">
//                   {currency.symbol}{formatAmount(tx.Amount)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };













import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "../ui/Loader";
import { Transaction } from "@/utils/mockData";

interface SettleDebtsCardProps {
  transactions: Transaction[];
  onSettle: () => Promise<void>;
  isSettling: boolean;
  currency: { symbol: string };
  memberMap: { [key: string]: { name: string; email: string } };
}

// Helper function to safely format the amount
const formatAmount = (amount: string | number): string => {
  let parsed: number;
  if (typeof amount === "number") {
    parsed = amount;
  } else {
    parsed = parseFloat(amount);
  }
  // Check if parsed is a valid number
  if (isNaN(parsed)) {
    return "0.00";
  }
  return parsed.toFixed(2);
};

function esewaCall(formData: any) {
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    const form = document.createElement("form");
    form.setAttribute("action", path);
    form.setAttribute("method", "POST");

    Object.keys(formData).forEach((key) => {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async function handleEsewaPayment() {
    const url = "http://localhost:3000/api";

    const uniqueTransactionId = new Date().getTime().toString();

    const data = {
      amount: "100",
      transaction_uuid: uniqueTransactionId,
      product_code: "EPAYTEST",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        esewaCall(responseData.formData);
      } else {
        console.error("Failed to fetch payment data");
      }
    } catch (err) {
      console.error("Error during payment process", err);
    }
  }


export const SettleDebtsCard = ({
  transactions,
  onSettle,
  isSettling,
  currency,
  memberMap,
}: SettleDebtsCardProps) => {
  const getDisplayName = (id: string) => {
    // Lookup the member from the map and only return the email.
    const member = memberMap[id];
    return member && member.email ? member.email : "Unknown User";
  };

  return (
    <Card className="border-none shadow-subtle">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Settle Group Debts</CardTitle>
        <Button onClick={onSettle} disabled={isSettling} className="rounded-md">
          {isSettling ? (
            <>
              <Loader size="sm" className="mr-2" />
              Calculating...
            </>
          ) : (
            "Settle Debts"
          )}
        </Button>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No settlement transactions yet. Click "Settle Debts" to calculate who owes whom.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-4 font-medium text-sm text-muted-foreground pb-2 border-b">
              <span>From</span>
              <span className="text-center">To</span>
              <span className="text-right">Amount</span>
              <span className="text-center">Action</span>
            </div>
            {transactions.map((tx) => (
              <div
                key={tx.TransactionID}
                className="grid grid-cols-4 items-center py-2"
              >
                <span className="truncate">{getDisplayName(tx.From)}</span>
                <span className="text-center truncate">
                  {getDisplayName(tx.To)}
                </span>
                <span className="text-right font-medium">
                  {currency.symbol}{formatAmount(tx.Amount)}
                </span>
                <span className="text-center">
                <button onClick={handleEsewaPayment}>Pay Now</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
