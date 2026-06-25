'use client'

import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useState } from 'react'
import Preview from '@/components/mdx/preview'
import { Checkbox } from '@/components/mdx/preview-controls/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/mdx/preview-controls/tabs'

export default function GradientCompare() {
  const [backgroundImage, setBackgroundImage] = useState(true)

  return (
    <Tabs>
      <Preview.Controls>
        <TabsList>
          <TabsTrigger value="eased">Eased</TabsTrigger>
          <TabsTrigger value="linear">Linear</TabsTrigger>
        </TabsList>
      </Preview.Controls>
      <div className="overflow-clip">
        <div className="px-4 py-8 sm:px-16 sm:py-16 flex items-center justify-center">
          <div className="bg-white shadow-xl border border-border-subtle rounded-xl flex-1 w-full p-4 gap-4">
            <div className="relative flex-1 rounded-lg overflow-clip outline outline-black/10 bg-rose-50 -outline-offset-1 aspect-4/3">
              {backgroundImage && (
                <Image
                  src="writing/tw-utilities/monet-autoportrait.webp"
                  fill
                  className="object-cover"
                  alt="Meules à Giverny (1893) - Claude Monet"
                />
              )}

              <TabsContent value="linear">
                <div className="absolute left-0 right-0 bottom-0 h-42 sm:h-56 bg-linear-to-t from-rose-950/80 to-transparent" />
              </TabsContent>
              <TabsContent value="eased">
                <div className="absolute left-0 right-0 bottom-0 h-42 sm:h-56 bg-eased-linear-to-t from-rose-950/80 to-transparent" />
              </TabsContent>

              <div className="text-white absolute inset-4 flex flex-col justify-end gap-2">
                <h3 className="text-xl sm:text-3xl tracking-tighter font-semibold">Claude Monet</h3>
                <p className="opacity-90 text-xs sm:text-sm tracking-wide font-medium">
                  Experience the revered French impressionist. Coming this July at the Pier Museum.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-lg flex text-sm gap-2 font-medium items-center bg-white border text-foreground py-2 pl-4 pr-3 mt-4 group hover:bg-foreground/10 transition-colors duration-200"
            >
              Reserve Now
              <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      <Preview.Controls>
        <Checkbox defaultChecked onCheckedChange={(checked) => setBackgroundImage(checked)}>
          Background Image
        </Checkbox>
      </Preview.Controls>
    </Tabs>
  )
}
