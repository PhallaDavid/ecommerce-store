"use client"

export function ImageBanners() {
  return (
    <section className="space-y-3">
      <div className="flex w-full h-[250px] md:h-[400px]">
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"
          alt="Image 1"
          className="w-full h-full flex-1 object-cover"
        />
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"
          alt="Image 2"
          className="w-full h-full flex-1 object-cover"
        />
      </div>
    </section>
  )
}

export function ImageBanner() {
  return <ImageBanners />
}
