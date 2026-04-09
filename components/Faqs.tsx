"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/components/LanguageProvider"
import { HelpCircle } from "lucide-react"

export function Faqs() {
  const { t } = useLanguage()

  const faqData = [
    {
      id: "item-1",
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      id: "item-2",
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      id: "item-3",
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
  ]

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto ">
        <div className="max-w-8xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-2">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              {t("faq.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("faq.description")}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id} 
                className="bg-card border rounded-2xl px-6 transition-all hover:shadow-md data-[state=open]:shadow-md data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left font-semibold text-lg hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
