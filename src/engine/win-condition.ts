import { Player, Team } from '../types';
import { ROLES } from './roles';

export function checkWinCondition(players: Player[]): Team | null {
  const alivePlayers = players.filter(p => p.isAlive);
  
  let mafiaCount = 0;
  let townCount = 0;

  for (const player of alivePlayers) {
    if (player.roleId) {
      const role = ROLES[player.roleId];
      if (role.team === 'mafia') {
        mafiaCount++;
      } else if (role.team === 'town') {
        townCount++;
      }
    }
  }

  if (mafiaCount === 0) {
    return 'town';
  }

  if (mafiaCount >= townCount) {
    return 'mafia';
  }

  return null;
}
