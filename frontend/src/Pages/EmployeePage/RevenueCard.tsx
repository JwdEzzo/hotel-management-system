import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import { useGetBookingsQuery } from "@/api/bookingsApi";

function RevenueCard() {
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !bookings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading revenue data</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => {
    const price =
      typeof booking.totalPrice === "string"
        ? parseFloat(booking.totalPrice)
        : Number(booking.totalPrice);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">
          From {bookings.length} bookings
        </p>
      </CardContent>
    </Card>
  );
}

export default RevenueCard;
