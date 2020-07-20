CREATE TABLE public.users
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  surname text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_key UNIQUE (email)
);
CREATE TABLE public.schools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  CONSTRAINT schools_pkey PRIMARY KEY (id)
);
CREATE TABLE public.school_lessons
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school uuid NOT NULL,
  title text NOT NULL,
  description text,
  CONSTRAINT school_lessons_pkey PRIMARY KEY (id),
  CONSTRAINT school_school_lessons_fkey FOREIGN KEY ("school")
      REFERENCES public.schools (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
);
CREATE TABLE public.user_school_lessons
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "user" uuid NOT NULL,
  lesson uuid NOT NULL,
  CONSTRAINT user_school_lessons_pkey PRIMARY KEY (id),
  CONSTRAINT users_school_lessons_fkey FOREIGN KEY ("user")
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT lesson_school_lessons_fkey FOREIGN KEY ("lesson")
      REFERENCES public.school_lessons (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
);
CREATE TABLE public.categories
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lesson_categories
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category uuid NOT NULL,
  lesson uuid NOT NULL,
  CONSTRAINT lesson_categories_pkey PRIMARY KEY (id),
  CONSTRAINT category_lesson_categories_fkey FOREIGN KEY ("category")
      REFERENCES public.categories (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT lesson_lesson_categories_fkey FOREIGN KEY ("lesson")
      REFERENCES public.school_lessons (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
);
