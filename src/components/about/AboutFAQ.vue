<script setup lang="ts">
const faqGroups = [
  {
    title: 'General Questions',
    items: [
      {
        question: 'Can I adopt if I rent my home?',
        answer:
          'Yes. Renters can adopt with landlord or HOA approval that confirms pets are allowed.',
      },
      {
        question: 'Do you offer post-adoption support?',
        answer:
          'Yes. Our team provides guidance after adoption, including transition tips and behavioral support resources.',
      },
      {
        question: 'Can I return the pet if the match is not successful?',
        answer:
          'Yes. Contact IDOHR directly so we can coordinate a safe return plan and next placement steps.',
      },
      {
        question: 'How long does the adoption process usually take?',
        answer:
          'Timelines vary by pet and application volume, but most completed applications are reviewed within a few days.',
      },
      {
        question: 'Are adoption fees the same for every pet?',
        answer:
          'Not always. Fees can vary based on age, medical history, and special care needs, and each profile lists current details.',
      },
    ],
  },
  {
    title: 'Cat-Specific Questions',
    items: [
      {
        question: 'Do adult cats need another cat at home?',
        answer:
          'It depends on the cat. Some do best with a companion, while others thrive as solo pets. We list this in each cat profile.',
      },
      {
        question: 'Can kittens be adopted in pairs?',
        answer:
          'Often yes. Paired kitten adoptions are encouraged when possible because they benefit from social development together.',
      },
      {
        question: 'What litter setup should I have before pickup?',
        answer:
          'Have at least one litter box per cat plus one extra, unscented litter, food and water stations, and a quiet decompression space.',
      },
      {
        question: 'Should I keep a new cat in one room at first?',
        answer:
          'Yes. A quiet starter room helps your cat decompress and adjust before gradually exploring the rest of the home.',
      },
      {
        question: 'How should I introduce a new cat to resident pets?',
        answer:
          'Use slow, supervised introductions with scent swapping and short sessions to reduce stress and support a safer transition.',
      },
    ],
  },
  {
    title: 'Dog-Specific Questions',
    items: [
      {
        question: 'Is a fenced yard required to adopt a dog?',
        answer:
          'Not always. Apartment and condo adopters can qualify with a realistic daily exercise and potty plan.',
      },
      {
        question: 'How soon should I begin training with a new dog?',
        answer:
          'Start immediately with calm routines and positive reinforcement. Consistency in the first few weeks is key.',
      },
      {
        question: 'Can I schedule a meet-and-greet with my current dog?',
        answer:
          "Yes. If a profile allows meet-and-greets, we can coordinate a safe introduction based on the dog's temperament and status.",
      },
      {
        question: 'What supplies should I prepare before bringing a new dog home?',
        answer:
          'Have a leash, collar with ID tag, crate or safe rest area, food and water bowls, appropriate food, and enrichment toys ready.',
      },
      {
        question: 'How much daily exercise will my adopted dog need?',
        answer:
          'Exercise needs depend on age, breed, and energy level, and we can help you choose a dog whose needs match your routine.',
      },
    ],
  },
]
</script>

<template>
  <section class="about-faq" aria-labelledby="about-faq-title">
    <p class="eyebrow">Before you ask</p>
    <h2 id="about-faq-title">Adoption FAQs</h2>
    <div class="groups">
      <section
        v-for="group in faqGroups"
        :key="group.title"
        class="group"
        :aria-label="group.title"
      >
        <h3>{{ group.title }}</h3>
        <div class="faq-list">
          <details
            v-for="faqItem in group.items"
            :key="`${group.title}-${faqItem.question}`"
            class="faq-details"
          >
            <summary class="faq-question">
              <svg
                class="arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ faqItem.question }}
            </summary>
            <p class="faq-answer">{{ faqItem.answer }}</p>
          </details>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped lang="css">
.about-faq {
  padding: 90px var(--layout-padding-side);
  background-color: var(--text-inverse);
  color: var(--text-primary);

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    text-align: center;
    margin-bottom: 12px;
  }

  h2 {
    text-align: center;
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 2.5rem;
    color: var(--text-primary);
  }

  .groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    max-width: 1600px;
    margin: 0 auto;
    border-top: 1px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
  }

  .group {
    padding: 1.5rem 1.75rem 1.75rem;
    border-right: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

    &:last-child {
      border-right: none;
    }

    h3 {
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
  }

  .faq-list {
    display: flex;
    flex-direction: column;
  }

  .faq-details {
    border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    padding: 0.85rem 0;

    &[open] .arrow {
      transform: rotate(90deg);
    }
  }

  .faq-question {
    list-style: none;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-weight: 700;
    line-height: 1.4;
    cursor: pointer;
    color: var(--text-primary);

    &:hover {
      color: var(--color-secondary);
    }

    &::-webkit-details-marker {
      display: none;
    }
  }

  .faq-answer {
    margin: 0.6rem 0 0 1.7rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .arrow {
    transition: transform 0.2s;
    flex-shrink: 0;
    color: var(--color-secondary);
    margin-top: 1px;
  }

  @media (width <= 1024px) {
    .groups {
      grid-template-columns: 1fr;
    }

    .group {
      border-right: none;
      border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      padding: 1.5rem 0;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
