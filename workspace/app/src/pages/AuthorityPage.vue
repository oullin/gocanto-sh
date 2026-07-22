<script setup lang="ts">
import { education, experience, profile, projects, talks } from "@gocanto/store";
import type { AuthorityPageRecord } from "@gocanto/store";

defineProps<{ page: AuthorityPageRecord }>();

const selectedProjects = projects.data.slice(0, 6);
const year = new Date().getFullYear();
</script>

<template>
    <div class="authority-shell">
        <header class="authority-nav">
            <a class="authority-brand" href="/">gocanto</a>
            <nav aria-label="Profile pages">
                <a href="/resume">Resume</a>
                <a href="/expertise/regulated-ai-systems">Regulated AI</a>
                <a href="/expertise/banking-core-modernisation">Banking modernisation</a>
                <a href="/expertise/payment-systems">Payments</a>
                <a href="https://writing.gocanto.sh/">Writing</a>
            </nav>
        </header>

        <main class="authority-main">
            <nav class="authority-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Gustavo Ocanto</a>
                <span aria-hidden="true">/</span>
                <span>{{ page.kind === "resume" ? "Resume" : "Expertise" }}</span>
            </nav>

            <header class="authority-hero">
                <p class="authority-eyebrow">{{ page.eyebrow }}</p>
                <h1>{{ page.heading }}</h1>
                <p class="authority-lead">{{ page.lead }}</p>
                <div class="authority-actions">
                    <a
                        class="authority-action authority-action--primary"
                        :href="`mailto:${profile.data.email}`"
                        data-analytics="contact-cta"
                    >
                        Discuss an architecture problem
                    </a>
                </div>
            </header>

            <ul class="authority-proof" aria-label="Selected proof">
                <li v-for="item in page.proof" :key="item">{{ item }}</li>
            </ul>

            <template v-if="page.kind === 'resume'">
                <section class="authority-section">
                    <div class="authority-section__intro">
                        <p class="authority-kicker">Experience</p>
                        <h2>Career timeline</h2>
                    </div>
                    <div class="resume-timeline">
                        <article
                            v-for="role in experience.data"
                            :key="role.uuid"
                            class="resume-role"
                        >
                            <div class="resume-role__head">
                                <div>
                                    <h3>{{ role.position }}</h3>
                                    <p>{{ role.company }} · {{ role.city }}, {{ role.country }}</p>
                                </div>
                                <time>{{ role.start_date }} — {{ role.end_date }}</time>
                            </div>
                            <div class="resume-role__summary" v-html="role.summary"></div>
                            <p class="resume-role__skills">{{ role.skills }}</p>
                        </article>
                    </div>
                </section>

                <section class="authority-section authority-section--split">
                    <div>
                        <p class="authority-kicker">Education</p>
                        <h2>Formal study</h2>
                        <article
                            v-for="item in education.data"
                            :key="item.uuid"
                            class="resume-compact"
                        >
                            <h3>{{ item.degree }}, {{ item.field }}</h3>
                            <p>
                                {{ item.school }} · {{ item.graduated_at }} ·
                                {{ item.issuing_country }}
                            </p>
                        </article>
                    </div>
                    <div>
                        <p class="authority-kicker">Speaking</p>
                        <h2>Recorded talks</h2>
                        <a
                            v-for="talk in talks.data"
                            :key="talk.uuid"
                            :href="talk.url"
                            class="resume-compact resume-compact--link"
                        >
                            <h3>{{ talk.title }}</h3>
                            <p>{{ talk.subject }} · {{ talk.location }}</p>
                        </a>
                    </div>
                </section>

                <section class="authority-section">
                    <div class="authority-section__intro">
                        <p class="authority-kicker">Selected work</p>
                        <h2>Open systems and tools</h2>
                    </div>
                    <div class="authority-projects">
                        <a
                            v-for="project in selectedProjects"
                            :key="project.uuid"
                            :href="project.url"
                        >
                            <span>{{ project.language }}</span>
                            <h3>{{ project.title }}</h3>
                            <p>{{ project.excerpt }}</p>
                        </a>
                    </div>
                </section>
            </template>

            <template v-else>
                <section
                    v-for="section in page.sections"
                    :key="section.heading"
                    class="authority-section authority-section--expertise"
                >
                    <div>
                        <p class="authority-kicker">How I work</p>
                        <h2>{{ section.heading }}</h2>
                        <p>{{ section.body }}</p>
                    </div>
                    <ul>
                        <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
                    </ul>
                </section>
            </template>

            <section class="authority-section authority-writing">
                <div class="authority-section__intro">
                    <p class="authority-kicker">First-hand detail</p>
                    <h2>Related engineering writing</h2>
                </div>
                <div class="authority-writing__links">
                    <a
                        v-for="item in page.related_writing"
                        :key="item.url"
                        :href="item.url"
                        data-analytics="writing-transition"
                    >
                        {{ item.label }} <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </section>

            <section class="authority-cta">
                <p>Have a system where correctness, recovery, or auditability matters?</p>
                <a :href="`mailto:${profile.data.email}`" data-analytics="contact-cta">
                    Send the architecture problem
                </a>
            </section>
        </main>

        <footer class="authority-footer">
            <span>© {{ year }} Gustavo Ocanto</span>
            <span>Singapore · English and Spanish</span>
        </footer>
    </div>
</template>
