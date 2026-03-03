import { Link } from "@tanstack/react-router";
import { MessageCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/products";

type ProductCardProps = {
  product: Product;
};

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProductCard = ({ product }: ProductCardProps) => {
  const isNew = new Date(product.createdAt) > oneWeekAgo;

  return (
    <Link to={`/products/$id`} params={{ id: product.id }}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <div className="px-4 pt-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="rounded-xl h-40 w-full object-cover"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-base leading-tight">
              {product.title}
            </h2>
            {isNew && (
              <Badge variant="secondary" className="text-xs shrink-0">
                NEW
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <Separator />

          <div className="flex items-center justify-between mt-4">
            {product.user && (
              <div className="flex items-center gap-2">
                <img
                  src={product.user.imageUrl}
                  alt={product.user.name}
                  className="size-6 rounded-full ring-1 ring-primary object-cover"
                />
                <span className="text-xs text-muted-foreground">
                  {product.user.name}
                </span>
              </div>
            )}
            {product.comments && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircleIcon className="size-3" />
                <span className="text-xs">{product.comments.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
