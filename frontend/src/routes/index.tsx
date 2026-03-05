import { useProducts } from "../hooks/useProducts";
import { Loader2, PackageIcon, SparklesIcon } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SignInButton } from "@clerk/clerk-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "#/types/products";
import ProductCard from "#/components/ProductCard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useProducts();
  const products = data?.data ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Something went wrong. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      {/* HERO */}
      <div className="rounded-2xl overflow-hidden bg-linear-to-br from-muted via-background to-muted border">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 p-8 lg:p-12">
          {/* Image */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110" />
            <img
              src="./image.png"
              alt="Creator"
              className="relative h-64 lg:h-72 rounded-2xl shadow-2xl object-cover"
            />
          </div>

          {/* Text */}
          <div className="text-center lg:text-left space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Share Your <span className="text-primary">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload, discover, and connect with creators.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                <SparklesIcon className="size-4" />
                Start Selling
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <PackageIcon className="size-5 text-primary" />
          All Products
        </h2>

        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center text-center py-16 gap-3">
              <PackageIcon className="size-16 text-muted-foreground/30" />
              <h3 className="font-semibold text-muted-foreground">
                No products yet
              </h3>
              <p className="text-muted-foreground/60 text-sm">
                Be the first to share something!
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link to="/create">Create Product</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
