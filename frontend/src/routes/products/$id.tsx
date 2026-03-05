import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { useDeleteProduct, useProduct } from "#/hooks/useProducts";
import { useAuth } from "@clerk/clerk-react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  Loader2,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
// import CommentsSection from "#/components/CommentsSection";
import type { Product } from "#/types/products";
import CommentsSection from "#/components/CommentsSection";

export const Route = createFileRoute("/products/$id")({
  beforeLoad: ({ context }) => {
    if (context.isClerkLoaded && !context.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id }: { id: string } = Route.useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useProduct(id);
  const product: Product | undefined = data?.data;
  const deleteProduct = useDeleteProduct(id);

  const handleDelete = () => {
    deleteProduct.mutate(id, { onSuccess: () => navigate({ to: "/" }) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center text-center gap-4 py-10">
          <h2 className="text-lg font-semibold text-destructive">
            Product not found
          </h2>
          <Button asChild size="sm">
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isOwner = userId === product.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeftIcon className="size-4" /> Back
          </Link>
        </Button>

        {isOwner && (
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link
                to="/edit/$id"
                params={{ id: product.id }}
                className="flex items-center gap-1"
              >
                <EditIcon className="size-4" /> Edit
              </Link>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-400 hover:cursor-pointer"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <Card>
          <CardContent className="p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name}
              </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {product.user && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <img
                    src={product.user.imageUrl}
                    alt={product.user.name}
                    className="size-12 rounded-full ring-2 ring-primary ring-offset-2"
                  />
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-muted-foreground">Creator</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comments */}
      <Card>
        <CardContent className="p-6">
          <CommentsSection
            productId={id}
            comments={product.comments}
            currentUserId={userId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
