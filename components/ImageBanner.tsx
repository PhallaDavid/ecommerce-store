"use client"

export function ImageBanners() {
  return (
    <section className="w-full ">
      <div className="flex w-full gap-4 h-full">
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"
          alt="Image 1"
          className="w-1/2 h-full object-cover"
        />
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg"
          alt="Image 2"
          className="w-1/2 h-full object-cover"
        />
      </div>
      <div className="flex w-full gap-4 h-full">
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-Casuals-WEB%20HP.jpg"
          alt="Image 1"
          className="w-1/2 h-full object-cover"
        />
        <img
          src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-Partywear-WEB%20HP.jpg"
          alt="Image 2"
          className="w-1/2 h-full object-cover"
        />
      </div>
    </section>
  )
}

export function ImageBanner() {
  return <ImageBanners />
}