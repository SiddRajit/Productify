import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useMyProducts, useDeleteProduct } from "#/hooks/useProducts";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
  Loader2,
  PlusIcon,
  PackageIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import type { Product } from "#/types/products";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ context }) => {
    if (context.isClerkLoaded && !context.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data, isLoading } = useMyProducts();
  const products: Product[] = data?.data ?? [];
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground text-sm">Manage your listings</p>
        </div>
        <Button asChild size="sm">
          <Link to="/create" className="flex items-center gap-1">
            <PlusIcon className="size-4" /> New
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-4xl font-bold text-primary">{products.length}</p>
        </CardContent>
      </Card>

      {/* Products */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center text-center gap-3 py-16">
            <PackageIcon className="size-16 text-muted-foreground/20" />
            <h3 className="font-semibold text-muted-foreground">
              No products yet
            </h3>
            <p className="text-muted-foreground/60 text-sm">
              Start by creating your first product
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link to="/create">Create Product</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex gap-4 p-0 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-32 shrink-0 object-cover rounded-l-xl"
                />
                <div className="flex flex-col justify-between py-4 pr-4 flex-1">
                  <div>
                    <h2 className="font-semibold">{product.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        navigate({
                          to: "/products/$id",
                          params: { id: product.id },
                        })
                      }
                    >
                      <EyeIcon className="size-3" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        navigate({
                          to: "/edit/$id",
                          params: { id: product.id },
                        })
                      }
                    >
                      <EditIcon className="size-3" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1 bg-red-500 hover:bg-red-400"
                      disabled={deleteProduct.isPending}
                      onClick={() => handleDelete(product.id)}
                    >
                      {deleteProduct.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2Icon className="size-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
