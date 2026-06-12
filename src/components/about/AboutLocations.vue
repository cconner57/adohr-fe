<template>
  <section class="locations">
    <div class="content-wrapper" v-scroll-reveal>
      <p class="eyebrow">Where to find us</p>
      <h2>Come say hello</h2>
      <p>We host many volunteer and adoption activities through our PetSmart partner location.</p>
      <address>
        PetSmart Pasadena<br />
        3347 E Foothill Blvd, Pasadena, CA 91107
      </address>
      <div class="location-hours">
        <p class="hours-heading">Visiting Hours &amp; Adoption Events</p>
        <div class="schedule-list">
          <article class="schedule-item">
            <p class="schedule-title">Cat Center Volunteer Hours</p>
            <p class="schedule-days">Monday through Friday</p>
            <p class="schedule-time">10:00 AM to 12:00 PM and 6:00 PM to 8:00 PM</p>
          </article>
          <article class="schedule-item">
            <p class="schedule-title">Adoption Events</p>
            <p class="schedule-days">Saturday and Sunday</p>
            <p class="schedule-time">12:00 PM to 4:00 PM</p>
          </article>
        </div>
        <p class="visit-note">
          Volunteers are on-site during Cat Center hours to feed, clean, and socialize with the
          cats. Potential adopters and potential volunteers are welcome to stop by if they are
          interested in adopting or volunteering.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.locations {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: 90px var(--layout-padding-side);

  .content-wrapper {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning);
  }

  h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.12;
    color: var(--text-inverse);
  }

  p {
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.6;
    color: oklch(from var(--text-inverse) l c h / 88%);
  }

  address {
    font-style: normal;
    font-weight: 700;
    line-height: 1.5;
    color: var(--text-inverse);
  }

  .location-hours {
    margin-top: 1.25rem;
    max-width: 720px;

    .hours-heading {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      margin-bottom: 0.9rem;
      color: var(--text-inverse);
    }

    .schedule-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem;
    }

    .schedule-item {
      background-color: var(--text-inverse);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      padding: 1.1rem 1.2rem;
      text-align: left;
      box-shadow: var(--shadow-lg);
    }

    .schedule-title {
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: var(--text-primary);
      padding-bottom: 0.55rem;
      margin-bottom: 0.55rem;
      border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    }

    .schedule-days {
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-secondary);
    }

    .schedule-time {
      margin-top: 0.3rem;
      font-size: 0.98rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .visit-note {
      margin-top: 1rem;
      font-size: 0.98rem;
      line-height: 1.55;
    }

    @media (width <= 430px) {
      .schedule-list {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
