<script lang="ts">
    import Tooltip from "./Tooltip.svelte";
    import { onMount } from "svelte";
    import { ExtensionStorage, type IStorage } from "../util/storage";
    import balance from "../icons/payment-balance.png";
    import bank from "../icons/payment-bank.png";
    import card from "../icons/payment-card.png";
    import wechat from "../icons/payment-wechat.png";

    export let showModal: boolean;
	let text = "Preferred Payment Methods";
	
    let choices: { [K in keyof IStorage["preferredPayments"]]: { text: string, icon: string } } = {
		balance: { text: "BUFF balance-Alipay", icon: balance},
        bank: { text: "BUFF Balance-Bank Card", icon: bank},
        card: { text: "Alipay - Credit card", icon: card},
        wechat: { text: "WeChat Pay", icon: wechat},
        "wechat-split": { text: "WeChat Split", icon: wechat},
	};
    
	let storage = ExtensionStorage.preferredPayments;
	let values: Partial<IStorage["preferredPayments"]> = {};

    onMount(async () => {
        values = await storage.getValue();
        console.log(values);
    });

    const storeValue = async (choice: keyof IStorage["preferredPayments"]) => {
		values[choice] = !values[choice];

		await storage.setValue(values as IStorage["preferredPayments"]);
    };

	const notypecheck = (x:string)=>x as keyof IStorage["preferredPayments"];
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-2 px-3">
	<div class="inline-flex gap-2 mt-1 mx-1">
		<span class="label-text text-primary">{text}</span>
		<!-- <Tooltip tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" dataTip="Listings that do not support your selected payment methods will be grayed out." /> -->
        <button on:click={() => showModal = true} title="Click for a detailed explanation">
                <svg class="w-4 h-4 text-info hover:text-base-100" aria-hidden="true" fill="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
                    ><path
                        fill="currentColor"
                        d="M11.95 18q.525 0 .888-.363t.362-.887q0-.525-.362-.888t-.888-.362q-.525 0-.887.363t-.363.887q0 .525.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m.1-14.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2" /></svg>
        </button>
	</div>
	<div class="flex mx-2 gap-2 mt-2">
		{#each Object.entries(choices) as [choice, attr]}
			<!-- <label for={choice} class="flex justify-between mx-2 mt-1">
				<span class="label-text text-primary">{choiceText}</span>
				<input type="checkbox" class="toggle toggle-info" id={choice} name={choiceText} value={choice} checked={values[notypecheck(choice)]} on:click={() => storeValue(notypecheck(choice))}>
			</label> -->
            <div class="tooltip inline-flex tooltip-primary z-100" data-tip={attr.text}>
                <button class="btn btn-ghost btn-sm rounded-full {values[notypecheck(choice)] ? 'bg-[#00b3f0]/50' : ''}" on:click={() => storeValue(notypecheck(choice))} data-popover-target="popover-description" data-popover-placement="bottom-end">
                    <img src={attr.icon} alt={attr.text} class="w-6 h-6"/>
                </button>
            </div>
		{/each}
	</div>
    <dialog id="dialog_preferred_payments" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Hello!</h3>
          <p class="py-4">Select your available payment methods. Listings that do not support at least one of your selected payment methods will be grayed out. HINT: If you are using Buff as a foreigner, likely you can only use 'BUFF balance-Alipay'.</p>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
    </dialog>
</div>
