<script setup lang="ts">
import type { IPet } from '../../../models/common'

defineProps<{
  pet: IPet
}>()
</script>

<template>
  <div class="adopt-detail__adoption-process">
    <h2>Adoption Process</h2>
    <ol v-if="pet.species === 'cat'">
      <li>
        <span>Submit Your Application</span> <br />
        <p>
          Tell us about yourself, your home, and the kind of cat you’re hoping to welcome into your
          family.
        </p>
      </li>
      <li>
        <span> Share Your Home Photos or Video </span>
        <p>
          Help us get to know your space by sending a few photos or a quick video tour so we can
          make sure it’s a safe, happy place for your future feline friend.
        </p>
      </li>
      <li>
        <span>Adoption Fee &amp; Final Steps</span>
        <p>
          Once your application is reviewed, we’ll work with you to finalize the adoption with a
          small fee that helps cover your cat’s care, vaccinations, and microchipping.
        </p>
      </li>
      <li>
        <span>Adoption Day! 🎉</span> <br />
        <p>
          Congratulations! Your new cat is ready to come home. We’ll be here to support you as they
          settle in and start exploring their new home.
        </p>
      </li>
    </ol>
    <ol v-else>
      <li>
        <span>Submit Your Application</span> <br />
        <p>
          Tell us a little about yourself, your home, and the kind of dog you’re hoping to welcome
          into your life.
        </p>
      </li>
      <li>
        <span>Chat With Our Team</span> <br />
        <p>
          After reviewing your application, a friendly volunteer will reach out for a quick
          conversation to get to know you and answer any questions.
        </p>
      </li>
      <li>
        <span>Virtual Home Visit</span> <br />
        <p>
          To ensure a safe and loving environment, we’ll take a virtual tour of your home via video
          call.
        </p>
      </li>
      <li>
        <span>Meet &amp; Greet</span> <br />
        <p>
          Meet your potential new best friend! We’ll arrange a meet-and-greet with all household
          members (including pets) to ensure everyone gets along.
        </p>
      </li>
      <li>
        <span>Adoption Fee &amp; Final Steps</span> <br />
        <p>
          Once it’s a match, we’ll finalize the adoption with a small fee that helps cover your
          dog’s care, vaccinations, and microchipping.
        </p>
      </li>
      <li>
        <span>Welcome Home! 🎉</span> <br />
        <p>
          Congratulations! Your new family member is ready to come home. We’re here to support you
          as your dog settles in and begins their new adventure.
        </p>
      </li>
    </ol>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__adoption-process {
  width: 100%;
}

h2 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.015em;
  margin-bottom: 16px;

  @media (width <= 440px) {
    font-size: 1.25rem;
  }
}

ol {
  padding-left: 0;
  margin-bottom: 16px;
  list-style: none;
  counter-reset: process;
}

li {
  counter-increment: process;
  position: relative;
  padding: 12px 0 12px 32px;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  margin-bottom: 0;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: counter(process, decimal-leading-zero);
    position: absolute;
    left: 0;
    top: 12px;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--color-secondary);
  }
}

li span {
  font-weight: 700;

  @media (width <= 440px) {
    font-size: 1rem;
  }
}

li p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  line-height: 1.55;
  padding-left: 0;
  font-weight: 400;

  @media (width <= 440px) {
    font-size: 0.95rem;
  }
}
</style>
