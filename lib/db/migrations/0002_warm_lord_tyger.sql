ALTER TABLE "players" ADD COLUMN "user_id" uuid;--> statement-breakpoint
CREATE INDEX "players_user_id_idx" ON "players" USING btree ("user_id");--> statement-breakpoint
-- ============================================================================
-- FK players.user_id → auth.users(id) ON DELETE CASCADE.
-- auth.users appartient au schéma géré par Supabase Auth ; la création de la
-- contrainte peut échouer si la connexion utilisée par la migration n'a pas
-- le droit USAGE sur le schéma auth. Dans ce cas, exécuter manuellement le
-- bloc SQL dans Supabase Dashboard → SQL Editor (avec service_role).
-- ============================================================================
DO $$
BEGIN
  ALTER TABLE "players"
    ADD CONSTRAINT "players_user_id_auth_users_fk"
    FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE;
  RAISE NOTICE 'FK players.user_id -> auth.users(id) installed.';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'INSUFFICIENT PRIVILEGE: FK players.user_id NOT installed via this migration. Run the ALTER TABLE manually in Supabase Dashboard SQL Editor.';
  WHEN duplicate_object THEN
    RAISE NOTICE 'FK players.user_id already exists, skipping.';
  WHEN OTHERS THEN
    RAISE NOTICE 'FK players.user_id installation failed: %. Apply manually if needed.', SQLERRM;
END;
$$;--> statement-breakpoint
-- ============================================================================
-- Trigger : assigne raw_app_meta_data.role = 'player' à tout nouvel
-- utilisateur Supabase Auth. Lit dans user.app_metadata.role côté JWT.
-- Q6 = approche (α) raw_app_meta_data JSONB (pas d'Auth Hook Dashboard).
--
-- Comme la FK ci-dessus, la création peut échouer si la connexion n'a pas
-- le droit de poser un trigger sur auth.users. Dans ce cas, exécuter le
-- bloc manuellement dans Supabase Dashboard → SQL Editor (service_role).
-- ============================================================================
DO $$
BEGIN
  CREATE OR REPLACE FUNCTION public.set_default_user_role()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    NEW.raw_app_meta_data =
      COALESCE(NEW.raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', 'player');
    RETURN NEW;
  END;
  $func$;

  DROP TRIGGER IF EXISTS on_auth_user_created_set_role ON auth.users;
  CREATE TRIGGER on_auth_user_created_set_role
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.set_default_user_role();

  RAISE NOTICE 'Auth trigger on_auth_user_created_set_role installed.';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'INSUFFICIENT PRIVILEGE: auth trigger NOT installed via this migration. Run the trigger SQL manually in Supabase Dashboard SQL Editor.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Auth trigger installation failed: %. Apply manually if needed.', SQLERRM;
END;
$$;
