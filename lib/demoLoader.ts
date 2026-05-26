import { agencyDemoCases, getAgencyDemoPlan } from "@/demoData/agencyDemo";

export function loadOfflineDemo(demoCaseId = agencyDemoCases[0].id) {
  return getAgencyDemoPlan(demoCaseId);
}
