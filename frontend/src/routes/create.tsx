import { useCreateProduct } from "#/hooks/useProducts";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { ArrowLeft, SparklesIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  beforeLoad: ({ context }) => {
    if (context.isClerkLoaded && !context.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
    onSubmit: ({ value }) => {
      createProduct.mutate(value, {
        onSuccess: () => {
          form.reset();
          toast.success("Product created successfully");
          navigate({ to: "/" });
        },
        onError: (error) => {
          console.error("Error creating product", error);
          toast.error("Error creating product");
        },
      });
    },
  });

  return (
    <div className="flex h-full justify-center items-center flex-col">
      <div className="w-full max-w-xl flex flex-col gap-4">
        <Link
          to="/"
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
            <SparklesIcon className="text-primary size-6" />
            <h1 className="text-lg font-bold leading-tight tracking-tight">
              New Product
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
                      placeholder="Enter product descrition..."
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
                    <FieldLabel>Image Url</FieldLabel>
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
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
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
