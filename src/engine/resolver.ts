import { NightActions, NightResult, Player } from '../types';
import { ROLES } from './roles';

export function resolveNight(actions: NightActions, players: Player[]): NightResult {
  const result: NightResult = {
    killedPlayerId: null,
    investigatedPlayer: null,
  };

  // 1. Resolve Kill
  if (actions.mafiaKillTargetId) {
    // If the doctor saved the same person, nobody dies
    if (actions.doctorSaveTargetId !== actions.mafiaKillTargetId) {
      result.killedPlayerId = actions.mafiaKillTargetId;
    }
  }

  // 2. Resolve Investigation
  if (actions.detectiveInvestigateTargetId) {
    const target = players.find(p => p.id === actions.detectiveInvestigateTargetId);
    if (target && target.roleId) {
      const role = ROLES[target.roleId];
      if (role) {
        result.investigatedPlayer = {
          id: target.id,
          team: role.team,
        };
      }
    }
  }

  return result;
}
