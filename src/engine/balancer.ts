import { RoleConfig } from '../types';

export function balanceRoles(playerCount: number): RoleConfig {
  if (playerCount < 5) {
    return { villager: playerCount }; // Invalid game really, but fallback
  }

  if (playerCount === 5) return { mafia: 1, doctor: 1, villager: 3 };
  if (playerCount === 6) return { mafia: 1, doctor: 1, detective: 1, villager: 3 };
  if (playerCount === 7) return { mafia: 2, doctor: 1, detective: 1, villager: 3 };
  if (playerCount === 8) return { mafia: 2, doctor: 1, detective: 1, villager: 4 };
  if (playerCount === 9) return { mafia: 2, doctor: 1, detective: 1, villager: 5 };
  if (playerCount === 10) return { mafia: 3, doctor: 1, detective: 1, villager: 5 };
  if (playerCount === 11) return { mafia: 3, doctor: 1, detective: 1, villager: 6 };
  if (playerCount === 12) return { mafia: 3, doctor: 1, detective: 2, villager: 6 };

  // 13+ players
  const mafia = Math.floor(playerCount * 0.25);
  const doctor = 1;
  const detective = playerCount >= 15 ? 2 : 1;
  const villager = playerCount - mafia - doctor - detective;

  return { mafia, doctor, detective, villager };
}
