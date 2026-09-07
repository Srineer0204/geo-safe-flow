CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  affected_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (true);

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;