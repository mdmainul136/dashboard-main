"use client";

import { useMemo, useSyncExternalStore, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare, ThumbsUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getReviews, subscribeReviews, updateReview, type Review } from "@/data/reviews";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const ProductReviews = () => {
  const reviews = useSyncExternalStore(subscribeReviews, getReviews, getReviews);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = useMemo(() => {
    const published = reviews.filter((r) => r.status === "published");
    const avgRating = published.length ? published.reduce((s, r) => s + r.rating, 0) / published.length : 0;
    return {
      total: reviews.length,
      published: published.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      avgRating: avgRating.toFixed(1),
      totalHelpful: reviews.reduce((s, r) => s + r.helpful, 0),
    };
  }, [reviews]);

  const ratingDist = useMemo(() => {
    return [5, 4, 3, 2, 1].map((r) => ({
      rating: `${r} â˜…`,
      count: reviews.filter((rv) => rv.rating === r && rv.status === "published").length,
    }));
  }, [reviews]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reviews;
    return reviews.filter((r) => r.status === statusFilter);
  }, [reviews, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Reviews & Ratings</h1>
          <p className="text-muted-foreground">Manage customer reviews and product ratings</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><MessageSquare className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Reviews</p><p className="text-2xl font-bold">{stats.total}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-amber-500/10 p-3"><Star className="h-5 w-5 text-amber-500" /></div><div><p className="text-sm text-muted-foreground">Avg Rating</p><p className="text-2xl font-bold">{stats.avgRating}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-500/10 p-3"><CheckCircle className="h-5 w-5 text-emerald-500" /></div><div><p className="text-sm text-muted-foreground">Published</p><p className="text-2xl font-bold">{stats.published}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-orange-500/10 p-3"><Clock className="h-5 w-5 text-orange-500" /></div><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-3"><ThumbsUp className="h-5 w-5 text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Helpful Votes</p><p className="text-2xl font-bold">{stats.totalHelpful}</p></div></div></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ratingDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="rating" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={40} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Reviews</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.productName}</TableCell>
                      <TableCell>{r.author}</TableCell>
                      <TableCell><StarRating rating={r.rating} /></TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{r.comment}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "published" ? "default" : r.status === "pending" ? "secondary" : "destructive"}>{r.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {r.status !== "published" && (
                            <Button size="sm" variant="outline" onClick={() => updateReview(r.id, { status: "published" })}>
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {r.status !== "rejected" && (
                            <Button size="sm" variant="outline" onClick={() => updateReview(r.id, { status: "rejected" })}>
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductReviews;

