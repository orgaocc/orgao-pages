DROP POLICY IF EXISTS "Service role full access on launch_config" ON public.launch_config;

CREATE POLICY "Service role insert launch_config"
ON public.launch_config
FOR INSERT
TO service_role
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update launch_config"
ON public.launch_config
FOR UPDATE
TO service_role
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role delete launch_config"
ON public.launch_config
FOR DELETE
TO service_role
USING (auth.role() = 'service_role');