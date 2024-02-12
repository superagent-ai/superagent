DO $$
BEGIN
    -- Check if the 'superagent' bucket exists
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'superagent'
    ) THEN
        -- If it exists and public is not TRUE, update it to be TRUE
        UPDATE storage.buckets
        SET "public" = TRUE
        WHERE name = 'superagent' AND "public" IS NOT TRUE;
    ELSE
        -- If it does not exist, insert the new bucket with public set to TRUE
        INSERT INTO storage.buckets (id, name, "public")
        VALUES ('superagent', 'superagent', TRUE);
    END IF;
END $$;

-- Correcting policy existence checks
-- Check if the public read access policy exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        JOIN pg_class ON pg_policy.polrelid = pg_class.oid
        JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
        WHERE pg_policy.polname = 'Public read access'
          AND pg_class.relname = 'objects'
          AND pg_namespace.nspname = 'storage'
    ) THEN
        CREATE POLICY "Public read access"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = 'superagent');
    END IF;
END $$;

-- Check if the insert access policy for authenticated users exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        JOIN pg_class ON pg_policy.polrelid = pg_class.oid
        JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
        WHERE pg_policy.polname = 'Enable insert access for authenticated users only'
          AND pg_class.relname = 'objects'
          AND pg_namespace.nspname = 'storage'
    ) THEN
        CREATE POLICY "Enable insert access for authenticated users only"
        ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'superagent');
    END IF;
END $$;
