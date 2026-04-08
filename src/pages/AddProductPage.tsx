import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { createProduct } from "../api/products";
import { getCategories } from "../api/categories";
import {
  createProductSchema,
  type CreateProductFormData,
  type Category,
  type Product,
} from "../types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(
      createProductSchema,
    ) as Resolver<CreateProductFormData>,
    defaultValues: {
      title: "",
      description: "",
      images: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        toast.error("Gagal memuat kategori");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    void fetchCategories();
  }, []);

  const onSubmit = async (data: CreateProductFormData) => {
    setIsSubmitting(true);
    try {
      const images = data.images
        ? data.images
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)
        : ["https://placehold.co/600x400"];

      const newProduct = await createProduct({
        title: data.title,
        price: data.price,
        description: data.description ?? "",
        categoryId: data.categoryId,
        images,
      });

      window.dispatchEvent(
        new CustomEvent<Product>("product-added", { detail: newProduct }),
      );

      toast.success("Product curated successfully!");
      reset();
      navigate("/products");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message;
        toast.error(
          typeof message === "string"
            ? message
            : Array.isArray(message)
              ? (message as string[]).join(", ")
              : "Failed to add product. Try again.",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-12 font-manrope">
      {/* Left Column: Context & Guidelines */}
      <div className="w-full md:w-1/3 flex flex-col pt-8">
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-colors mb-8 cursor-pointer w-fit"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Collection
        </button>

        <div className="sticky top-32">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface leading-none mb-6 font-headline">
            New Curated Item
          </h1>
          <p className="text-on-surface-variant font-body text-base lg:text-lg leading-relaxed opacity-80 mb-8">
            Add a new object to the StoreMini editorial collection. Ensure all
            details are accurate, high-fidelity, and meet our curation
            standards.
          </p>
        </div>
      </div>

      {/* Right Column: Editorial Form */}
      <div className="w-full md:w-2/3 max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_32px_64px_-12px_rgba(25,28,30,0.04)] p-8 lg:p-12 border border-outline-variant/10 mb-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          id="add-product-form"
        >
          <div className="space-y-6 pb-8 border-b border-outline-variant/20">
            <h2 className="text-sm font-bold text-outline uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">dataset</span>
              Basic Information
            </h2>

            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant pl-1"
              >
                Product Name <span className="text-error">*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                id="title"
                placeholder="e.g. Minimalist Oak Lounge Chair"
                maxLength={150}
                className={`w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-xl py-4 px-5 text-sm font-body transition-all placeholder:text-outline/60 outline-none ${
                  errors.title
                    ? "ring-error focus:ring-error"
                    : "ring-outline-variant/15 focus:ring-primary/40"
                }`}
              />
              {errors.title && (
                <p className="px-1 text-xs font-semibold text-error">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant pl-1"
                >
                  Price (USD) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline font-bold">
                    $
                  </span>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    id="price"
                    placeholder="0.00"
                    min={1}
                    step="1"
                    className={`w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-xl py-4 pl-9 pr-5 text-sm font-body transition-all placeholder:text-outline/60 outline-none ${
                      errors.price
                        ? "ring-error focus:ring-error"
                        : "ring-outline-variant/15 focus:ring-primary/40"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="px-1 text-xs font-semibold text-error">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="categoryId"
                  className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant pl-1"
                >
                  Category <span className="text-error">*</span>
                </label>
                {isLoadingCategories ? (
                  <div className="flex items-center gap-2 py-4 px-5 text-sm font-body text-outline bg-surface-container-high rounded-xl">
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Loading categories...
                  </div>
                ) : (
                  <select
                    {...register("categoryId", { valueAsNumber: true })}
                    id="categoryId"
                    className={`w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-xl py-4 px-5 text-sm font-body transition-all outline-none appearance-none cursor-pointer ${
                      errors.categoryId
                        ? "ring-error focus:ring-error"
                        : "ring-outline-variant/15 focus:ring-primary/40"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.categoryId && (
                  <p className="px-1 text-xs font-semibold text-error">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b border-outline-variant/20">
            <h2 className="text-sm font-bold text-outline uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">article</span>
              Details
            </h2>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant pl-1"
              >
                Description{" "}
                <span className="text-outline font-normal normal-case tracking-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows={4}
                placeholder="Provide an editorial description..."
                className="w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-xl py-4 px-5 text-sm font-body transition-all placeholder:text-outline/60 outline-none resize-none ring-outline-variant/15 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="space-y-6 pb-4">
            <h2 className="text-sm font-bold text-outline uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">imagesmode</span>
              Media
            </h2>

            {/* Images */}
            <div className="space-y-2">
              <label
                htmlFor="images"
                className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant pl-1"
              >
                Image URLs{" "}
                <span className="text-outline font-normal normal-case tracking-normal">
                  (Optional, comma separated)
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-outline material-symbols-outlined text-lg">
                  link
                </span>
                <input
                  {...register("images")}
                  type="text"
                  id="images"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-xl py-4 pl-12 pr-5 text-sm font-body transition-all placeholder:text-outline/60 outline-none ring-outline-variant/15 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 mt-8">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm uppercase tracking-widest py-4 px-10 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              id="submit-product"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <span>Curate Item</span>
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
