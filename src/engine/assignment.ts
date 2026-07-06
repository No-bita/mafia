import { Player, RoleConfig } from '../types';

export function assignRoles(players: Player[], roleConfig: RoleConfig): Player[] {
  // 1. Build the role bag
  const roleBag: string[] = [];
  for (const [roleId, count] of Object.entries(roleConfig)) {
    for (let i = 0; i < count; i++) {
      roleBag.push(roleId);
    }
  }

  if (roleBag.length !== players.length) {
    throw new Error('Number of roles must match number of players');
  }

  // 2. Fisher-Yates shuffle
  const shuffled = [...roleBag];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Assign
  return players.map((p, index) => ({
    ...p,
    roleId: shuffled[index],
  }));
}
