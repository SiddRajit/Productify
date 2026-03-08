import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useUpdateProduct } from "#/hooks/useProducts";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { ArrowLeft, Loader2, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "#/types/products";
import { useEffect } from "react";

export const Route = createFileRoute("/edit/$id")({
  beforeLoad: ({ context }) => {
    if (context.isClerkLoaded && !context.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useProduct(id);
  const product: Product | undefined = data?.data;
  const updateProduct = useUpdateProduct(id);

  const form = useForm({
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
    },
    onSubmit: ({ value }) => {
      updateProduct.mutate(value, {
        onSuccess: () => {
          toast.success("Product updated successfully");
          navigate({ to: "/products/$id", params: { id } });
        },
        onError: () => {
          toast.error("Error updating product");
        },
      });
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl,
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  if (!product || product.userId !== userId) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center text-center gap-4 py-10">
          <h2 className="text-lg font-semibold text-destructive">
            {!product ? "Product not found" : "Access denied"}
          </h2>
          <Button asChild size="sm">
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-full justify-center items-center flex-col">
      <div className="w-full max-w-xl flex flex-col gap-4">
        <Link
          to="/products/$id"
          params={{ id }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full bg-black rounded-lg p-5"
        >
          <div className="flex gap-1 mb-3 items-center">
            <PencilIcon className="text-primary size-6" />
            <h1 className="text-lg font-bold leading-tight tracking-tight">
              Edit Product
            </h1>
          </div>

          <FieldGroup className="mb-4">
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter product title..."
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter product description..."
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="imageUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Image URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter product image url..."
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex justify-start gap-4">
                <Link to="/products/$id" params={{ id }}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
}
