import { Enum, u32 } from '@polkadot/types-codec'

export interface FrameSystemPhase extends Enum {
  readonly isApplyExtrinsic: boolean
  readonly asApplyExtrinsic: u32
  readonly isFinalization: boolean
  readonly isInitialization: boolean
  readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization'
}
